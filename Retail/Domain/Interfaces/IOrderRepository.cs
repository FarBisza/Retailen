using Retailen.Application.DTO.Order;
using Retailen.Domain.Entities;

namespace Retailen.Domain.Interfaces
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<bool> HasPurchasedProductAsync(int customerId, int productId);
        Task<Order?> GetByIdWithDetailsAsync(int orderId, int userId);
        Task<Order?> GetByIdWithDetailsAsync(int orderId);
        Task<IEnumerable<Order>> GetOrdersByUserIdWithDetailsAsync(int userId);
        Task<IEnumerable<Order>> GetAllOrdersWithDetailsAsync();
        Task<(IEnumerable<Order> Items, int TotalCount)> GetAllOrdersPagedAsync(int skip, int take);
        Task<Order?> GetOrderForProcessingAsync(int orderId);
        Task<OrderCountsDTO> GetOrderCountsAsync(int customerId);
    }
}
