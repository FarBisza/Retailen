using Retailen.Domain.Entities.Product;
using Retailen.Application.DTO.Product;
using Retailen.Application.Pagination;

namespace Retailen.Application.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();
        Task<Product?> GetProductByIdAsync(int id);
        Task<Product> AddProductAsync(CreateProductDTO dto);
        Task UpdateProductAsync(int id, UpdateProductDTO dto);
        Task DeleteProductAsync(int id);
        Task<(IEnumerable<Product> Products, int TotalCount)> GetProductsPagedAsync(PaginationParams pagination);
        Task<(IEnumerable<ProductDTO> Products, int TotalCount)> GetProductsDtoPagedAsync(PaginationParams pagination);
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category);
        Task<IEnumerable<ProductDTO>> GetAllProductsDtoAsync();
        Task<ProductDTO?> GetProductDtoByIdAsync(int id);
        Task<bool> CheckAvailabilityAsync(int productId, int quantity);
        Task<Review> AddReviewAsync(int productId, int customerId, AddReviewDTO review);
    }
}