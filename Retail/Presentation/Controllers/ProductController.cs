using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Retailen.Application.Interfaces;
using Retailen.Application.DTO;
using Retailen.Application.DTO.Product;
using Retailen.Application.Pagination;

namespace Retailen.Presentation.Controllers
{
    [ApiController]
    [Route("api/product")]
    public class ProductController : BaseApiController
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        /// <summary>
        /// Get products. Supports optional pagination via query params.
        /// Without page/pageSize — returns all products.
        /// With page/pageSize — returns a paged result with metadata.
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProducts([FromQuery] int? page = null, [FromQuery] int? pageSize = null)
        {
            if (page.HasValue || pageSize.HasValue)
            {
                var pagination = new PaginationParams
                {
                    PageNumber = page ?? 1,
                    PageSize = pageSize ?? 10
                };
                var (products, totalCount) = await _productService.GetProductsDtoPagedAsync(pagination);
                return Ok(new
                {
                    Items = products,
                    TotalCount = totalCount,
                    Page = pagination.PageNumber,
                    PageSize = pagination.PageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pagination.PageSize)
                });
            }

            var all = await _productService.GetAllProductsDtoAsync();
            return Ok(all);
        }

        /// <summary>
        /// Get products by category.
        /// </summary>
        [HttpGet("category/{category}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProductsByCategory(string category)
        {
            var products = await _productService.GetProductsByCategoryAsync(category);
            return Ok(products);
        }

        /// <summary>
        /// Get product by ID.
        /// </summary>
        [HttpGet("{id}")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ProductDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _productService.GetProductDtoByIdAsync(id);

            if (product == null)
                return NotFound(new { message = "Product not found" });

            return Ok(product);
        }

        /// <summary>
        /// Create a new product (Staff only).
        /// </summary>
        [HttpPost]
        [Authorize(Policy = "RequireStaff")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDTO dto)
        {
            try
            {
                var newProduct = await _productService.AddProductAsync(dto);
                return CreatedAtAction(nameof(GetProduct), new { id = newProduct.Id }, newProduct);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Update a product (Staff only).
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Policy = "RequireStaff")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDTO product)
        {
            try
            {
                await _productService.UpdateProductAsync(id, product);
                return Ok(new { message = "Product updated" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Delete a product (Staff only).
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireStaff")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                await _productService.DeleteProductAsync(id);
                return Ok(new { message = "Product deleted" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Add a review for a product.
        /// </summary>
        [HttpPost("{id}/review")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AddReview(int id, [FromBody] AddReviewDTO review)
        {
            var userId = GetCurrentUserIdOrNull();
            if (userId == null)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            try
            {
                var newReview = await _productService.AddReviewAsync(id, userId.Value, review);
                return CreatedAtAction(nameof(GetProduct), new { id = id }, newReview);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}