using Microsoft.EntityFrameworkCore;
using Retailen.Domain.Entities;
using Retailen.Domain.Interfaces;
using Retailen.Infrastructure.Persistence;

namespace Retailen.Infrastructure.Repositories
{
    public class InventoryRepository : Repository<Inventory>, IInventoryRepository
    {
        public InventoryRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Inventory?> GetByProductAndWarehouseAsync(int productId, int warehouseId)
        {
            return await _context.Inventory
                .FirstOrDefaultAsync(i => i.ProductId == productId && i.WarehouseId == warehouseId);
        }

        public async Task<IEnumerable<Inventory>> GetByProductIdAsync(int productId)
        {
             return await _context.Inventory
                .Where(i => i.ProductId == productId)
                .ToListAsync();
        }
    }
}
