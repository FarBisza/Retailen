using Retailen.Domain.Entities.Cart;

namespace Retailen.Domain.Interfaces
{
    public interface ICartRepository : IRepository<Cart>
    {
        Task<Cart?> GetCartWithItemsAsync(int cartId);
        Task<Cart?> GetActiveCartByCustomerAsync(int customerId);
        Task<Cart?> GetActiveCartBySessionAsync(string sessionId);
    }
}
