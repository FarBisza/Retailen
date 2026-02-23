using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Retailen.Application.Interfaces;
using Retailen.Application.DTO;
using Retailen.Application.DTO.Product;

namespace Retailen.Presentation.Controllers
{
    [ApiController]
    [Route("api/category")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<CategoryDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(CategoryDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCategory(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);

            if (category == null)
                return NotFound(new { message = "Category not found" });

            return Ok(category);
        }


        [HttpPost]
        [Authorize(Policy = "RequireAdmin")]
        [ProducesResponseType(typeof(CategoryDTO), StatusCodes.Status201Created)]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request)
        {
            var category = await _categoryService.CreateCategoryAsync(request.Name, request.ParentId);
            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }
    }

    public class CreateCategoryRequest
    {
        public string Name { get; set; } = string.Empty;
        public int? ParentId { get; set; }
    }
}