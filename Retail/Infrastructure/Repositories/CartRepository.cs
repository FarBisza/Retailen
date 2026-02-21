using Microsoft.EntityFrameworkCore;
using Retailen.Domain.Entities.Cart;
using Retailen.Domain.Interfaces;
using Retailen.Infrastructure.Persistence;

namespace Retailen.Infrastructure.Repositories
{
    public class CartRepository : Repository<Cart>, ICartRepository
    {
        public CartRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Cart?> GetCartWithItemsAsync(int cartId)
        {
            return await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.Id == cartId);
        }

        public async Task<Cart?> GetActiveCartByCustomerAsync(int customerId)
        {
            return await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.CustomerId == customerId && c.Active == true);
        }

        public async Task<Cart?> GetActiveCartBySessionAsync(string sessionId)
        {
            return await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.SessionId == sessionId && c.CustomerId == null && c.Active == true);
        }
    }
}
