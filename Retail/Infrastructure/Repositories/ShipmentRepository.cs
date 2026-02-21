using Microsoft.EntityFrameworkCore;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.Logistics;
using Retailen.Domain.Interfaces;
using Retailen.Infrastructure.Extensions;
using Retailen.Infrastructure.Persistence;

namespace Retailen.Infrastructure.Repositories
{
    public class ShipmentRepository : Repository<Shipment>, IShipmentRepository
    {
        public ShipmentRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Shipment>> GetAllWithDetailsAsync()
        {
            return await _context.Shipments
                .AsNoTracking()
                .Include(s => s.Warehouse)
                .Include(s => s.Status)
                .Include(s => s.Items)
                    .ThenInclude(i => i.OrderItem)
                        .ThenInclude(oi => oi.Product)
                .AsSplitQuery()
                .ToListAsync();
        }

        public async Task<(IEnumerable<Shipment> Items, int TotalCount)> GetAllPagedAsync(int skip, int take)
        {
            var query = _context.Shipments
                .AsNoTracking()
                .Include(s => s.Warehouse)
                .Include(s => s.Status)
                .Include(s => s.Items)
                    .ThenInclude(i => i.OrderItem)
                        .ThenInclude(oi => oi.Product)
                .OrderByDescending(s => s.Id)
                .AsSplitQuery();

            var (items, totalCount) = await query.ToPagedListAsync(skip, take);
            return (items, totalCount);
        }

        public async Task<Shipment?> GetByIdWithDetailsAsync(int id)
        {
            return await _context.Shipments
                .AsNoTracking()
                .Include(s => s.Warehouse)
                .Include(s => s.Status)
                .Include(s => s.Items)
                    .ThenInclude(i => i.OrderItem)
                        .ThenInclude(oi => oi.Product)
                .AsSplitQuery()
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<Shipment>> GetByOrderIdWithDetailsAsync(int orderId)
        {
            return await _context.Shipments
                .AsNoTracking()
                .Include(s => s.Warehouse)
                .Include(s => s.Status)
                .Include(s => s.Items)
                    .ThenInclude(i => i.OrderItem)
                        .ThenInclude(oi => oi.Product)
                .Where(s => s.OrderId == orderId)
                .AsSplitQuery()
                .ToListAsync();
        }
    }
}
