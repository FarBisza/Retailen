using Retailen.Application.DTO.Product;
using Retailen.Domain.Entities.Product;

namespace Retailen.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync();
        Task<CategoryDTO?> GetCategoryByIdAsync(int id);
        Task<CategoryDTO> CreateCategoryAsync(string name, int? parentId);
    }
}