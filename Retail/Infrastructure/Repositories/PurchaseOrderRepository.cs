using Microsoft.EntityFrameworkCore;
using Retailen.Domain.Entities.Logistics.Deliveries.Supplier;
using Retailen.Domain.Entities.Logistics;
using Retailen.Domain.Interfaces;
using Retailen.Infrastructure.Extensions;
using Retailen.Infrastructure.Persistence;

namespace Retailen.Infrastructure.Repositories
{
    public class PurchaseOrderRepository : Repository<PurchaseOrder>, IPurchaseOrderRepository
    {
        public PurchaseOrderRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<PurchaseOrder>> GetAllWithDetailsAsync()
        {
            return await _context.PurchaseOrders
                .AsNoTracking()
                .Include(po => po.Supplier)
                .Include(po => po.Status)
                .Include(po => po.Warehouse)
                .Include(po => po.Items)
                    .ThenInclude(i => i.Product)
                .AsSplitQuery()
                .ToListAsync();
        }

        public async Task<(IEnumerable<PurchaseOrder> Items, int TotalCount)> GetAllPagedAsync(int skip, int take)
        {
            var query = _context.PurchaseOrders
                .AsNoTracking()
                .Include(po => po.Supplier)
                .Include(po => po.Status)
                .Include(po => po.Warehouse)
                .Include(po => po.Items)
                    .ThenInclude(i => i.Product)
                .OrderByDescending(po => po.Id)
                .AsSplitQuery();

            var (items, totalCount) = await query.ToPagedListAsync(skip, take);
            return (items, totalCount);
        }

        public async Task<PurchaseOrder?> GetByIdWithDetailsAsync(int id)
        {
            return await _context.PurchaseOrders
                .Include(po => po.Supplier)
                .Include(po => po.Status)
                .Include(po => po.Warehouse)
                .Include(po => po.Items)
                    .ThenInclude(i => i.Product)
                .AsSplitQuery()
                .FirstOrDefaultAsync(po => po.Id == id);
        }

        public async Task<IEnumerable<PurchaseOrder>> GetBySupplierIdWithDetailsAsync(int supplierId)
        {
            return await _context.PurchaseOrders
                .AsNoTracking()
                .Include(po => po.Supplier)
                .Include(po => po.Status)
                .Include(po => po.Warehouse)
                .Include(po => po.Items)
                    .ThenInclude(i => i.Product)
                .Where(po => po.SupplierId == supplierId)
                .AsSplitQuery()
                .ToListAsync();
        }
    }
}
