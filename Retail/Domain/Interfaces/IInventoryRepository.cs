using Retailen.Domain.Entities;

namespace Retailen.Domain.Interfaces
{
    public interface IInventoryRepository : IRepository<Inventory>
    {
        Task<Inventory?> GetByProductAndWarehouseAsync(int productId, int warehouseId);
        Task<IEnumerable<Inventory>> GetByProductIdAsync(int productId);
    }
}
