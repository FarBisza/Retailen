using Retailen.Domain.Entities;

namespace Retailen.Application.Interfaces
{
    public interface IInventoryService
    {
        Task DeductStockAsync(int productId, int quantity, int orderId);
        Task RestoreStockAsync(int productId, int quantity, int orderId);
        Task AddStockAsync(int productId, int quantity, int warehouseId);
        Task<int> GetTotalStockAsync(int productId);
    }
}
