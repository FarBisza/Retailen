using Retailen.Domain.Entities.Logistics.GoodsReceipt;

namespace Retailen.Domain.Interfaces
{
    public interface IGoodsReceiptRepository : IRepository<GoodsReceipt>
    {
        Task<IEnumerable<GoodsReceipt>> GetAllWithDetailsAsync();
        Task<GoodsReceipt?> GetByIdWithDetailsAsync(int id);
    }
}
