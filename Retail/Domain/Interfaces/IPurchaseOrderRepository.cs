using Retailen.Application.DTO.Logistics;
using Retailen.Domain.Entities.Logistics.Deliveries.Supplier;
using Retailen.Domain.Entities.Logistics;

namespace Retailen.Domain.Interfaces
{
    public interface IPurchaseOrderRepository : IRepository<PurchaseOrder>
    {
        Task<IEnumerable<PurchaseOrder>> GetAllWithDetailsAsync();
        Task<(IEnumerable<PurchaseOrder> Items, int TotalCount)> GetAllPagedAsync(int skip, int take);
        Task<PurchaseOrder?> GetByIdWithDetailsAsync(int id);
        Task<IEnumerable<PurchaseOrder>> GetBySupplierIdWithDetailsAsync(int supplierId);
    }
}
