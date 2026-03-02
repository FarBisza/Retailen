using Microsoft.EntityFrameworkCore;
using Retailen.Domain.Entities;
using Retailen.Domain.Interfaces;
using Retailen.Infrastructure.Extensions;
using Retailen.Infrastructure.Persistence;

namespace Retailen.Infrastructure.Repositories
{
    public class ReturnRepository : Repository<Return>, IReturnRepository
    {
        public ReturnRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Return>> GetAllWithDetailsAsync()
        {
            return await _context.Returns
                .AsNoTracking()
                .Include(r => r.Customer)
                .Include(r => r.Order)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<(IEnumerable<Return> Items, int TotalCount)> GetAllPagedAsync(int skip, int take)
        {
            var query = _context.Returns
                .AsNoTracking()
                .Include(r => r.Customer)
                .Include(r => r.Order)
                .OrderByDescending(r => r.CreatedAt);
            var (items, totalCount) = await query.ToPagedListAsync(skip, take);
            return (items, totalCount);
        }

        public async Task<IEnumerable<Return>> GetByCustomerIdWithDetailsAsync(int customerId)
        {
            return await _context.Returns
                .AsNoTracking()
                .Include(r => r.Order)
                .Where(r => r.CustomerId == customerId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Return>> GetByStatusWithDetailsAsync(int statusId)
        {
            return await _context.Returns
                .AsNoTracking()
                .Include(r => r.Customer)
                .Include(r => r.Order)
                .Where(r => r.ReturnStatusId == statusId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<Return?> GetByIdWithDetailsAsync(int id)
        {
            return await _context.Returns
                .Include(r => r.Customer)
                .Include(r => r.Order)
                .FirstOrDefaultAsync(r => r.ReturnId == id);
        }
    }
}
