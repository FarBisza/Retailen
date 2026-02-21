using Moq;
using Retailen.Application.Pagination;
using Retailen.Application.Services;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.Product;
using Attribute = Retailen.Domain.Entities.Product.Attribute;
using Retailen.Domain.Interfaces;
using System.Linq.Expressions;

namespace Retailen.Tests.Unit
{
    public class ProductServiceTests
    {
        private readonly Mock<IProductRepository> _mockProductRepo;
        private readonly Mock<IRepository<Category>> _mockCategoryRepo;
        private readonly Mock<IRepository<Attribute>> _mockAttrDefRepo;
        private readonly Mock<IRepository<Inventory>> _mockInventoryRepo;
        private readonly Mock<IOrderRepository> _mockOrderRepo;
        private readonly Mock<IRepository<Review>> _mockReviewRepo;
        private readonly Mock<IRepository<Customer>> _mockCustomerRepo;
        private readonly ProductService _service;

        public ProductServiceTests()
        {
            _mockProductRepo = new Mock<IProductRepository>();
            _mockCategoryRepo = new Mock<IRepository<Category>>();
            _mockAttrDefRepo = new Mock<IRepository<Attribute>>();
            _mockInventoryRepo = new Mock<IRepository<Inventory>>();
            _mockOrderRepo = new Mock<IOrderRepository>();
            _mockReviewRepo = new Mock<IRepository<Review>>();
            _mockCustomerRepo = new Mock<IRepository<Customer>>();

            _service = new ProductService(
                _mockProductRepo.Object,
                _mockCategoryRepo.Object,
                _mockAttrDefRepo.Object,
                _mockInventoryRepo.Object,
                _mockOrderRepo.Object,
                _mockReviewRepo.Object,
                _mockCustomerRepo.Object
            );
        }

        [Fact]
        public async Task GetAllProducts_ReturnsAllActive()
        {
            // Arrange — use constructor which sets Active = true
            var products = new List<Product>
            {
                new Product("Chair", 50m) { Id = 1 },
                new Product("Table", 100m) { Id = 2 }
            };
            _mockProductRepo.Setup(r => r.GetAllWithDetailsAsync())
                .ReturnsAsync(products);

            // Act
            var result = await _service.GetAllProductsAsync();

            // Assert
            Assert.Equal(2, result.Count());
            _mockProductRepo.Verify(r => r.GetAllWithDetailsAsync(), Times.Once);
        }

        [Fact]
        public async Task GetProductById_Exists_ReturnsProduct()
        {
            // Arrange
            var product = new Product("Sofa", 999m) { Id = 1 };
            _mockProductRepo.Setup(r => r.GetByIdWithDetailsAsync(1))
                .ReturnsAsync(product);

            // Act
            var result = await _service.GetProductByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Sofa", result.Name);
        }

        [Fact]
        public async Task GetProductById_NotFound_ReturnsNull()
        {
            // Arrange
            _mockProductRepo.Setup(r => r.GetByIdWithDetailsAsync(It.IsAny<int>()))
                .ReturnsAsync((Product?)null);

            // Act
            var result = await _service.GetProductByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteProduct_Exists_CallsDelete()
        {
            // Arrange
            var product = new Product("ToDelete", 10m) { Id = 1 };
            _mockProductRepo.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(product);

            // Act
            await _service.DeleteProductAsync(1);

            // Assert — soft-delete: product is deactivated, not removed
            Assert.False(product.Active);
            _mockProductRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteProduct_NotFound_ThrowsKeyNotFoundException()
        {
            // Arrange
            _mockProductRepo.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync((Product?)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.DeleteProductAsync(999));
        }

        [Fact]
        public async Task CheckAvailability_SufficientStock_ReturnsTrue()
        {
            // Arrange — Product constructor sets Active = true
            var product = new Product("InStock", 10m) { Id = 1 };
            _mockProductRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);

            var inventory = new List<Inventory>
            {
                new Inventory { ProductId = 1, Quantity = 100 }
            };
            _mockInventoryRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<Inventory, bool>>>()))
                .ReturnsAsync(inventory);

            // Act
            var result = await _service.CheckAvailabilityAsync(1, 50);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task CheckAvailability_InsufficientStock_ReturnsFalse()
        {
            // Arrange — Product constructor sets Active = true
            var product = new Product("LowStock", 10m) { Id = 1 };
            _mockProductRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);

            var inventory = new List<Inventory>
            {
                new Inventory { ProductId = 1, Quantity = 5 }
            };
            _mockInventoryRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<Inventory, bool>>>()))
                .ReturnsAsync(inventory);

            // Act
            var result = await _service.CheckAvailabilityAsync(1, 10);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task GetProductsPaged_ReturnsCorrectPageAndCount()
        {
            // Arrange
            var products = new List<Product>
            {
                new Product("P1", 10m),
                new Product("P2", 10m)
            };
            _mockProductRepo.Setup(r => r.GetProductsPagedAsync(1, 10))
                .ReturnsAsync((products, 15)); // Mocking total count 15

            var pagination = new PaginationParams { PageNumber = 1, PageSize = 10 };

            // Act
            var (resultProducts, totalCount) = await _service.GetProductsPagedAsync(pagination);

            // Assert
            Assert.Equal(15, totalCount);
            Assert.Equal(2, resultProducts.Count());
            _mockProductRepo.Verify(r => r.GetProductsPagedAsync(1, 10), Times.Once);
        }
    }
}
