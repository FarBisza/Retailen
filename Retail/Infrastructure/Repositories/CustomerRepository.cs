using Microsoft.EntityFrameworkCore;
using Retailen.Domain.Entities;
using Retailen.Domain.Interfaces;
using Retailen.Infrastructure.Extensions;
using Retailen.Infrastructure.Persistence;

namespace Retailen.Infrastructure.Repositories
{
    public class CustomerRepository : Repository<Customer>, ICustomerRepository
    {
        public CustomerRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<(IEnumerable<Customer> Items, int TotalCount)> GetAllPagedAsync(int skip, int take)
        {
            var query = _dbSet
                .AsNoTracking()
                .Include(c => c.Role)
                .OrderByDescending(c => c.Id);
            var (items, totalCount) = await query.ToPagedListAsync(skip, take);
            return (items, totalCount);
        }

        public async Task<Customer?> GetByEmailAsync(string email)
        {
            return await _dbSet
                .Include(c => c.RefreshTokens)
                .Include(c => c.Role)
                .FirstOrDefaultAsync(c => c.Email == email.ToLowerInvariant());
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _dbSet.AnyAsync(c => c.Email == email.ToLowerInvariant());
        }

        public async Task<Customer?> GetByRefreshTokenAsync(string token)
        {
            return await _dbSet
                .Include(c => c.RefreshTokens)
                .Include(c => c.Role)
                .SingleOrDefaultAsync(c => c.RefreshTokens.Any(t => t.Token == token));
        }

        public async Task<Customer?> GetByEmailAndConfirmationTokenAsync(string email, string token)
        {
            return await _dbSet
                .SingleOrDefaultAsync(c =>
                    c.Email == email.ToLowerInvariant() &&
                    c.EmailConfirmationToken == token);
        }

        public async Task<Customer?> GetByEmailAndResetTokenAsync(string email, string token)
        {
            return await _dbSet
                .SingleOrDefaultAsync(c =>
                    c.Email == email.ToLowerInvariant() &&
                    c.PasswordResetToken == token &&
                    c.ResetTokenExpires > DateTime.UtcNow);
        }

        public new async Task<IEnumerable<Customer>> GetAllAsync()
        {
            return await _dbSet
                .AsNoTracking()
                .Include(c => c.Role)
                .OrderByDescending(c => c.Id)
                .ToListAsync();
        }

        public new async Task<Customer?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(c => c.Role)
                .FirstOrDefaultAsync(c => c.Id == id);
        }
    }
}
