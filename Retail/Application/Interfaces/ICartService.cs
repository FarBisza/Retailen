using Retailen.Application.DTO.Cart;

namespace Retailen.Application.Interfaces
{
    public interface ICartService
    {
        Task<CartDTO> GetCartAsync(int? customerId, string sessionId);
        Task AddToCartAsync(AddToCartRequestDTO request);
        Task UpdateQuantityAsync(UpdateQuantityRequestDTO request, int? customerId, string sessionId);
        Task RemoveFromCartAsync(int cartId, int itemId, int? customerId, string sessionId);
        Task ClearCartAsync(int cartId, int? customerId, string sessionId);
        Task MergeCartAsync(int targetCustomerId, string sourceSessionId);
        Task FinalizeCartAsync(int cartId);
    }
}