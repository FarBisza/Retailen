using Retailen.Domain.Entities.Product;

namespace Retailen.Domain.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<Product?> GetByIdWithDetailsAsync(int id);
        Task<IEnumerable<Product>> GetAllWithDetailsAsync();
        Task<(IEnumerable<Product> Products, int TotalCount)> GetProductsPagedAsync(int page, int pageSize);
        Task<IEnumerable<Product>> GetProductsByCategoryIdAsync(int categoryId);
        Task<IEnumerable<Product>> GetProductsByIdsAsync(IEnumerable<int> ids);
    }
}
