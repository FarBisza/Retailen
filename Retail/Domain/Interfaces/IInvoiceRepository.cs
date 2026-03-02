using Retailen.Domain.Entities.Logistics.Deliveries.DeliveryDictionary;
using Retailen.Domain.Entities;

namespace Retailen.Domain.Interfaces
{
    public interface IInvoiceRepository : IRepository<Invoice>
    {
        Task<Invoice?> GetByOrderIdWithDetailsAsync(int orderId);
        Task<Invoice?> GetByIdWithOrderDetailsAsync(int invoiceId);
    }
}
