using Microsoft.EntityFrameworkCore;
using Retailen.Domain.Entities.Logistics.GoodsReceipt;
using Retailen.Domain.Interfaces;
using Retailen.Infrastructure.Persistence;

namespace Retailen.Infrastructure.Repositories
{
    public class GoodsReceiptRepository : Repository<GoodsReceipt>, IGoodsReceiptRepository
    {
        public GoodsReceiptRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<GoodsReceipt>> GetAllWithDetailsAsync()
        {
             return await _context.GoodsReceipts
                .AsNoTracking()
                .Include(gr => gr.Warehouse)
                .Include(gr => gr.Items)
                    .ThenInclude(i => i.Product)
                .AsSplitQuery()
                .ToListAsync();
        }

        public async Task<GoodsReceipt?> GetByIdWithDetailsAsync(int id)
        {
             return await _context.GoodsReceipts
                .Include(gr => gr.Warehouse)
                .Include(gr => gr.Items)
                    .ThenInclude(i => i.Product)
                .AsSplitQuery()
                .FirstOrDefaultAsync(gr => gr.Id == id);
        }
    }
}
