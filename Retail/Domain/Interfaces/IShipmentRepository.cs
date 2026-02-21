using Retailen.Domain.Entities;
using Retailen.Domain.Entities.Logistics;

namespace Retailen.Domain.Interfaces
{
    public interface IShipmentRepository : IRepository<Shipment>
    {
        Task<IEnumerable<Shipment>> GetAllWithDetailsAsync();
        Task<(IEnumerable<Shipment> Items, int TotalCount)> GetAllPagedAsync(int skip, int take);
        Task<Shipment?> GetByIdWithDetailsAsync(int id);
        Task<IEnumerable<Shipment>> GetByOrderIdWithDetailsAsync(int orderId);
    }
}
