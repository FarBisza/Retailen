using Retailen.Application.DTO;
using Retailen.Application.DTO.Order;
using Retailen.Application.Pagination;


namespace Retailen.Application.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDTO> CreateOrderAsync(CreateOrderRequestDTO request);
        Task<OrderDTO?> GetOrderByIdAsync(int orderId, int userId);
        Task<IEnumerable<OrderDTO>> GetOrdersByUserIdAsync(int userId);
        Task<CheckoutResponseDTO> CheckoutAsync(int customerId, AddressDTO address);
        Task PayAsync(int orderId, int customerId, PayRequestDTO request);
        Task RequestInvoiceAsync(int orderId, int customerId, BillingInfoRequestDTO request);
        Task<IEnumerable<OrderDTO>> GetAllOrdersAsync();
        Task<PagedResult<OrderDTO>> GetAllOrdersPagedAsync(PaginationParams pagination);
        Task StartProcessingAsync(int orderId);
        Task ShipOrderAsync(int orderId, string carrier, string trackingNumber);
        Task DeliverOrderAsync(int orderId);
        Task<OrderCountsDTO> GetOrderCountsAsync(int customerId);
        Task<object?> GetInvoiceByOrderIdAsync(int orderId, int? userId = null);
    }
}