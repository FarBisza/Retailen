using Microsoft.EntityFrameworkCore;
using Retailen.Application.Helpers;
using Retailen.Application.Interfaces;
using Retailen.Domain.Entities.Product;
using Attribute = Retailen.Domain.Entities.Product.Attribute;
using Retailen.Domain.Entities;
using Retailen.Infrastructure.Persistence;
using Retailen.Application.DTO;
using Retailen.Application.DTO.Product;
using Retailen.Application.Pagination;
using Retailen.Application.DTO.Attribute;
using System.Text.Json;
using Retailen.Domain.Interfaces;

namespace Retailen.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IRepository<Category> _categoryRepository;
        private readonly IRepository<Attribute> _attributeDefinitionRepository;
        private readonly IRepository<Inventory> _inventoryRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IRepository<Review> _reviewRepository;
        private readonly IRepository<Customer> _customerRepository;

        public ProductService(
            IProductRepository productRepository,
            IRepository<Category> categoryRepository,
            IRepository<Attribute> attributeDefinitionRepository,
            IRepository<Inventory> inventoryRepository,
            IOrderRepository orderRepository,
            IRepository<Review> reviewRepository,
            IRepository<Customer> customerRepository)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
            _attributeDefinitionRepository = attributeDefinitionRepository;
            _inventoryRepository = inventoryRepository;
            _orderRepository = orderRepository;
            _reviewRepository = reviewRepository;
            _customerRepository = customerRepository;
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            var products = await _productRepository.GetAllWithDetailsAsync();
            return products
                .Where(p => p.Active == true || p.Active == null)
                .OrderByDescending(p => p.CreatedAt);
        }

        /// <inheritdoc/>
        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _productRepository.GetByIdWithDetailsAsync(id);
        }

        /// <inheritdoc/>
        public async Task<Product> AddProductAsync(CreateProductDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ArgumentException("Product name is required");
            }

            if (dto.Price < 0)
            {
                throw new ArgumentException("Price cannot be negative");
            }

            var product = new Product(dto.Name, dto.Price);
            product.UpdateDetails(dto.Name, dto.Description, dto.Price, dto.ImageUrl);

            product.SetActive(dto.Active);

            if (dto.CategoryId.HasValue)
            {
                product.ProductCategories = new List<ProductCategory>
                {
                    new ProductCategory(0, dto.CategoryId.Value)
                };
            }

            if (dto.Attributes != null && dto.Attributes.Any())
            {
                product.ProductAttributes = new List<ProductAttribute>();

                var attrIds = dto.Attributes.Select(a => a.AttributeId).Distinct().ToList();
                var attributeDefs = await _attributeDefinitionRepository.FindAsync(a => attrIds.Contains(a.Id));

                foreach (var attrDto in dto.Attributes)
                {
                    var def = attributeDefs.FirstOrDefault(a => a.Id == attrDto.AttributeId);
                    if (def != null)
                    {
                        var pa = new ProductAttribute
                        {
                            AttributeId = attrDto.AttributeId
                        };
                        pa.SetValue(def.DataType, attrDto.Value);
                        product.ProductAttributes.Add(pa);
                    }
                }
            }

            await _productRepository.AddAsync(product);
            await _productRepository.SaveChangesAsync();

            return product;
        }

        /// <inheritdoc/>
        public async Task UpdateProductAsync(int id, UpdateProductDTO dto)
        {
            var product = await _productRepository.GetByIdWithDetailsAsync(id);

            if (product == null)
            {
                throw new KeyNotFoundException($"Product with ID {id} was not found");
            }

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ArgumentException("Product name is required");
            }

            if (dto.Price < 0)
            {
                throw new ArgumentException("Price cannot be negative");
            }

            product.UpdateDetails(dto.Name, dto.Description, dto.Price, dto.ImageUrl);

            if (dto.Active.HasValue)
            {
                product.SetActive(dto.Active.Value);
            }

            if (dto.CategoryId.HasValue)
            {
                product.ProductCategories.Clear();
                product.ProductCategories.Add(new ProductCategory(id, dto.CategoryId.Value));
            }

            if (dto.Attributes != null)
            {
                foreach (var attrDto in dto.Attributes)
                {
                    var existingAttr = product.ProductAttributes.FirstOrDefault(pa => pa.AttributeId == attrDto.AttributeId);
                    if (existingAttr != null)
                    {
                        existingAttr.SetValue("string", attrDto.Value);
                    }
                    else
                    {
                        var newAttr = new ProductAttribute
                        {
                            ProductId = id,
                            AttributeId = attrDto.AttributeId
                        };
                        newAttr.SetValue("string", attrDto.Value); 
                        product.ProductAttributes.Add(newAttr);
                    }
                }
            }

            await _productRepository.UpdateAsync(product);
            await _productRepository.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task DeleteProductAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);

            if (product == null)
            {
                throw new KeyNotFoundException($"Product with ID {id} was not found");
            }

            // Soft-delete: deactivate instead of removing to preserve FK integrity
            // (PurchaseOrderItem, OrderItem, Inventory, etc. reference this product)
            product.SetActive(false);
            await _productRepository.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task<(IEnumerable<Product> Products, int TotalCount)> GetProductsPagedAsync(PaginationParams pagination)
        {
            return await _productRepository.GetProductsPagedAsync(pagination.PageNumber, pagination.PageSize);
        }

        /// <inheritdoc/>
        public async Task<(IEnumerable<ProductDTO> Products, int TotalCount)> GetProductsDtoPagedAsync(PaginationParams pagination)
        {
            var (products, totalCount) = await _productRepository.GetProductsPagedAsync(pagination.PageNumber, pagination.PageSize);

            var inventory = await _inventoryRepository.GetAllAsync();
            var dtos = MapProductsToDtos(products, inventory);

            return (dtos, totalCount);
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category)
        {
            var categories = await _categoryRepository.FindAsync(c => c.Name == category);
            var parentCategory = categories.FirstOrDefault();

            if (parentCategory == null)
            {
                return new List<Product>();
            }

            var relatedCategories = await _categoryRepository.FindAsync(c => c.Id == parentCategory.Id || c.ParentId == parentCategory.Id);
            var categoryIds = relatedCategories.Select(c => c.Id).ToList();
            var allProducts = await _productRepository.GetAllWithDetailsAsync();
            
            return allProducts
                .Where(p => (p.Active == true || p.Active == null) && p.ProductCategories.Any(pc => categoryIds.Contains(pc.CategoryId)))
                .OrderByDescending(p => p.CreatedAt)
                .ToList();
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<ProductDTO>> GetAllProductsDtoAsync()
        {
            var products = (await _productRepository.GetAllWithDetailsAsync())
                .Where(p => p.Active == true || p.Active == null)
                .OrderByDescending(p => p.CreatedAt);
            var inventory = await _inventoryRepository.GetAllAsync();
            return MapProductsToDtos(products, inventory);
        }

        /// <inheritdoc/>
        public async Task<ProductDTO?> GetProductDtoByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdWithDetailsAsync(id);

            if (product == null) return null;

            var attributes = product.ProductAttributes.ToList();

            var inventoryItems = await _inventoryRepository.FindAsync(i => i.ProductId == id);
            var totalStock = inventoryItems.Sum(i => i.Quantity);

            var categories = product.ProductCategories.Select(pc => pc.Category).ToList();
            var leafCategory = categories.FirstOrDefault(c => c.ParentId != null);
            var rootCategory = categories.FirstOrDefault(c => c.ParentId == null);
            var categoryName = leafCategory?.Name ?? rootCategory?.Name
                               ?? attributes.FirstOrDefault(pa => pa.Attribute.Name == "Category")?.GetValue();

            var attributesDto = attributes.Select(pa => new ProductAttributeDTO
            {
                Id = pa.Id,
                ProductId = pa.ProductId,
                AttributeId = pa.AttributeId,
                AttributeName = pa.Attribute.Name,
                Value = pa.GetValue()
            }).ToList();

            var dto = new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Description = product.Description,
                InStock = (product.Active ?? false) && totalStock > 0,
                StockLevel = totalStock,
                ImageUrl = product.ImageUrl,
                Category = categoryName,
                Style = attributes.FirstOrDefault(pa => pa.Attribute.Name == "Style")?.GetValue(),
                Attributes = attributesDto
            };

            dto.Categories = categories.Select(c => c.Name).ToList();

            dto.Colors = attributes
                .Where(pa => pa.Attribute.Name == "Color" || pa.Attribute.Code == "color")
                .Select(pa => pa.GetValue())
                .Where(v => !string.IsNullOrEmpty(v))
                .Select(v => v!)
                .Distinct()
                .ToList();

            if (product.Reviews != null && product.Reviews.Any())
            {
                dto.Reviews = product.Reviews.Select(r => new ReviewDTO
                {
                    Id = r.Id.ToString(),
                    UserId = r.CustomerId?.ToString() ?? "anon",
                    UserName = r.Title ?? "Anonymous",
                    Rating = r.Rating,
                    Comment = r.Content ?? "",
                    Date = r.CreatedAt.ToString("yyyy-MM-dd")
                }).ToList();
            }

            return dto;
        }

        /// <inheritdoc/>
        public async Task<bool> CheckAvailabilityAsync(int productId, int quantity)
        {
            var product = await _productRepository.GetByIdAsync(productId);

            if (product == null || (product.Active.HasValue && !product.Active.Value))
            {
                return false;
            }

            var inventoryItems = await _inventoryRepository.FindAsync(i => i.ProductId == productId);
            var totalStock = inventoryItems.Sum(i => i.Quantity);

            return totalStock >= quantity;
        }

        /// <inheritdoc/>
        public async Task<Review> AddReviewAsync(int productId, int customerId, AddReviewDTO reviewDto)
        {
            var product = await _productRepository.GetByIdAsync(productId);
            if (product == null)
            {
                throw new KeyNotFoundException($"Product with ID {productId} was not found");
            }

            var customer = await _customerRepository.GetByIdAsync(customerId);
            if (customer == null)
            {
                throw new KeyNotFoundException($"Customer with ID {customerId} was not found");
            }

            var hasPurchased = await _orderRepository.HasPurchasedProductAsync(customerId, productId);

            if (!hasPurchased)
            {
                throw new InvalidOperationException("You can only review a product you have purchased.");
            }

            var review = new Review
            {
                ProductId = productId,
                CustomerId = customerId,
                Rating = (byte)Math.Clamp(reviewDto.Rating, 1, 5),
                Title = customer.FirstName + " " + customer.LastName,
                Content = reviewDto.Content,
                CreatedAt = DateTime.UtcNow,
                ModerationStatus = "Approved"
            };

            await _reviewRepository.AddAsync(review);
            await _reviewRepository.SaveChangesAsync();

            return review;
        }

        private List<ProductDTO> MapProductsToDtos(IEnumerable<Product> products, IEnumerable<Inventory> inventory)
        {
            var result = new List<ProductDTO>();

            foreach (var p in products)
            {
                var prodAttributes = p.ProductAttributes.ToList();
                var totalStock = inventory.Where(i => i.ProductId == p.Id).Sum(i => i.Quantity);

                var categories = p.ProductCategories.Select(pc => pc.Category).ToList();
                var leafCategory = categories.FirstOrDefault(c => c.ParentId != null);
                var rootCategory = categories.FirstOrDefault(c => c.ParentId == null);
                var categoryName = leafCategory?.Name ?? rootCategory?.Name
                                   ?? prodAttributes.FirstOrDefault(pa => pa.Attribute.Name == "Category")?.GetValue();

                var attributesDto = prodAttributes.Select(pa => new ProductAttributeDTO
                {
                    Id = pa.Id,
                    ProductId = pa.ProductId,
                    AttributeId = pa.AttributeId,
                    AttributeName = pa.Attribute.Name,
                    Value = pa.GetValue()
                }).ToList();

                var dto = new ProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    Description = p.Description,
                    InStock = (p.Active ?? false) && totalStock > 0,
                    StockLevel = totalStock,
                    ImageUrl = p.ImageUrl,
                    Category = categoryName,
                    Style = prodAttributes.FirstOrDefault(pa => pa.Attribute.Name == "Style")?.GetValue(),
                    Attributes = attributesDto
                };

                dto.Colors = prodAttributes
                    .Where(pa => pa.Attribute.Name == "Color" || pa.Attribute.Code == "color")
                    .Select(pa => pa.GetValue())
                    .Where(v => !string.IsNullOrEmpty(v))
                    .Select(v => v!)
                    .Distinct()
                    .ToList();

                dto.Categories = categories.Select(c => c.Name).ToList();

                if (p.Reviews != null && p.Reviews.Any())
                {
                    dto.Reviews = p.Reviews.Select(r => new ReviewDTO
                    {
                        Id = r.Id.ToString(),
                        UserId = r.CustomerId?.ToString() ?? "anon",
                        UserName = r.Title ?? "Anonymous",
                        Rating = r.Rating,
                        Comment = r.Content ?? "",
                        Date = r.CreatedAt.ToString("yyyy-MM-dd")
                    }).ToList();
                }

                result.Add(dto);
            }

            return result;
        }
    }
}