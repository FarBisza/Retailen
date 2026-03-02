using Microsoft.EntityFrameworkCore;
using Retailen.Application.DTO.Product;
using Retailen.Application.Interfaces;
using Retailen.Domain.Entities.Product;
using Retailen.Domain.Interfaces;

namespace Retailen.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IRepository<Category> _categoryRepository;

        public CategoryService(IRepository<Category> categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            
            return categories
                .OrderBy(c => c.Id)
                .Select(c => new CategoryDTO
                {
                    Id = c.Id,
                    ParentId = c.ParentId,
                    Name = c.Name
                });
        }

        /// <inheritdoc/>
        public async Task<CategoryDTO?> GetCategoryByIdAsync(int id)
        {
            var c = await _categoryRepository.GetByIdAsync(id);

            if (c == null) return null;

            return new CategoryDTO
            {
                Id = c.Id,
                ParentId = c.ParentId,
                Name = c.Name
            };
        }

        /// <inheritdoc/>
        public async Task<CategoryDTO> CreateCategoryAsync(string name, int? parentId)
        {
            var category = new Category(name, parentId);
            await _categoryRepository.AddAsync(category);
            await _categoryRepository.SaveChangesAsync();

            return new CategoryDTO
            {
                Id = category.Id,
                ParentId = category.ParentId,
                Name = category.Name
            };
        }
    }
}