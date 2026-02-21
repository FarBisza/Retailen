using Microsoft.EntityFrameworkCore;
using Retailen.Domain.Entities;
using Retailen.Domain.Interfaces;
using Retailen.Infrastructure.Persistence;

namespace Retailen.Infrastructure.Repositories
{
    public class InvoiceRepository : Repository<Invoice>, IInvoiceRepository
    {
        public InvoiceRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Invoice?> GetByOrderIdWithDetailsAsync(int orderId)
        {
            return await _dbSet
                .Include(i => i.InvoiceStatus)
                .Where(i => i.OrderId == orderId)
                .OrderByDescending(i => i.IssuedDate)
                .FirstOrDefaultAsync();
        }

        public async Task<Invoice?> GetByIdWithOrderDetailsAsync(int invoiceId)
        {
            return await _dbSet
                .Include(i => i.Order)
                .ThenInclude(o => o.Items)
                .ThenInclude(item => item.Product)
                .FirstOrDefaultAsync(i => i.Id == invoiceId);
        }
    }
}
