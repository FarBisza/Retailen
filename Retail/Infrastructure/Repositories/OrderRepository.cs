using Microsoft.EntityFrameworkCore;
using Retailen.Application.DTO.Order;
using Retailen.Domain.Entities;
using Retailen.Domain.Enums;
using Retailen.Domain.Interfaces;
using Retailen.Infrastructure.Extensions;
using Retailen.Infrastructure.Persistence;

namespace Retailen.Infrastructure.Repositories
{
    public class OrderRepository : Repository<Order>, IOrderRepository
    {
        public OrderRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<bool> HasPurchasedProductAsync(int customerId, int productId)
        {
            return await _context.Orders
                .AnyAsync(o => o.CustomerId == customerId
                            && o.Items.Any(item => item.ProductId == productId)
                            && o.OrderStatusId >= (int)OrderStatusEnum.Paid
                            && o.OrderStatusId != (int)OrderStatusEnum.Cancelled);
        }

        public async Task<Order?> GetByIdWithDetailsAsync(int orderId, int userId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Include(o => o.Items)
                .ThenInclude(item => item.Product)
                .Include(o => o.OrderStatusEntity)
                .Include(o => o.Shipments)
                .Include(o => o.ShippingAddress)
                .AsSplitQuery()
                .FirstOrDefaultAsync(o => o.Id == orderId && o.CustomerId == userId);
        }

        public async Task<Order?> GetByIdWithDetailsAsync(int orderId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Include(o => o.Items)
                .ThenInclude(item => item.Product)
                .Include(o => o.OrderStatusEntity)
                .Include(o => o.Shipments)
                .Include(o => o.ShippingAddress)
                .AsSplitQuery()
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public async Task<IEnumerable<Order>> GetOrdersByUserIdWithDetailsAsync(int userId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Include(o => o.OrderStatusEntity)
                .Include(o => o.Items)
                .ThenInclude(item => item.Product)
                .Include(o => o.Shipments)
                .Include(o => o.ShippingAddress)
                .Include(o => o.Invoices)
                .Where(o => o.CustomerId == userId)
                .OrderByDescending(o => o.OrderDate)
                .AsSplitQuery()
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetAllOrdersWithDetailsAsync()
        {
            return await _context.Orders
                .AsNoTracking()
                .Include(o => o.Items)
                .ThenInclude(item => item.Product)
                .Include(o => o.Shipments)
                .Include(o => o.ShippingAddress)
                .Include(o => o.OrderStatusEntity)
                .OrderByDescending(o => o.OrderDate)
                .AsSplitQuery()
                .ToListAsync();
        }

        public async Task<(IEnumerable<Order> Items, int TotalCount)> GetAllOrdersPagedAsync(int skip, int take)
        {
            var query = _context.Orders
                .AsNoTracking()
                .Include(o => o.Items)
                .ThenInclude(item => item.Product)
                .Include(o => o.Shipments)
                .Include(o => o.ShippingAddress)
                .Include(o => o.OrderStatusEntity)
                .OrderByDescending(o => o.OrderDate)
                .AsSplitQuery();

            var (items, totalCount) = await query.ToPagedListAsync(skip, take);
            return (items, totalCount);
        }

        public async Task<Order?> GetOrderForProcessingAsync(int orderId)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.Shipments)
                .Include(o => o.ShippingAddress)
                .Include(o => o.Customer)
                .AsSplitQuery()
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public async Task<OrderCountsDTO> GetOrderCountsAsync(int customerId)
        {
            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .Select(o => o.OrderStatusId)
                .ToListAsync();

            var deliveredOrderIds = await _context.Orders
                .Where(o => o.CustomerId == customerId && o.OrderStatusId == (int)OrderStatusEnum.Delivered)
                .Select(o => o.Id)
                .ToListAsync();

            var reviewedOrderIds = await _context.Reviews
                .Where(r => r.OrderItemId != null)
                .Join(_context.OrderItems,
                    r => r.OrderItemId,
                    oi => oi.Id,
                    (r, oi) => oi.OrderId)
                .Distinct()
                .ToListAsync();

            var unreviewedCount = deliveredOrderIds.Count(id => !reviewedOrderIds.Contains(id));

            var returnCount = await _context.Returns
                .CountAsync(r => r.CustomerId == customerId && r.ReturnStatusId <= (int)ReturnStatus.Approved);

            return new OrderCountsDTO
            {
                ToPay = orders.Count(s => s == (int)OrderStatusEnum.AwaitingPayment),
                ToShip = orders.Count(s => s == (int)OrderStatusEnum.Paid),
                Shipped = orders.Count(s => s == (int)OrderStatusEnum.Shipped),
                ToReview = unreviewedCount,
                Returns = returnCount
            };
        }
    }
}
