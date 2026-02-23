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
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly Mock<IRepository<Category>> _categoryRepositoryMock;
        private readonly Mock<IRepository<Attribute>> _attributeDefinitionRepositoryMock;
        private readonly Mock<IRepository<Inventory>> _inventoryRepositoryMock;
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly Mock<IRepository<Review>> _reviewRepositoryMock;
        private readonly Mock<IRepository<Customer>> _customerRepositoryMock;
        private readonly Mock<IRepository<InventoryThreshold>> _inventoryThresholdRepositoryMock;
        private readonly ProductService _productService;

        public ProductServiceTests()
        {
            _productRepositoryMock = new Mock<IProductRepository>();
            _categoryRepositoryMock = new Mock<IRepository<Category>>();
            _attributeDefinitionRepositoryMock = new Mock<IRepository<Attribute>>();
            _inventoryRepositoryMock = new Mock<IRepository<Inventory>>();
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _reviewRepositoryMock = new Mock<IRepository<Review>>();
            _customerRepositoryMock = new Mock<IRepository<Customer>>();
            _inventoryThresholdRepositoryMock = new Mock<IRepository<InventoryThreshold>>();

            _productService = new ProductService(
                _productRepositoryMock.Object,
                _categoryRepositoryMock.Object,
                _attributeDefinitionRepositoryMock.Object,
                _inventoryRepositoryMock.Object,
                _orderRepositoryMock.Object,
                _reviewRepositoryMock.Object,
                _customerRepositoryMock.Object,
                _inventoryThresholdRepositoryMock.Object
            );
        }

        [Fact]
        public async Task GetAllProducts_ReturnsAllActive()
        {
            var products = new List<Product>
            {
                new Product("Chair", 50m) { Id = 1 },
                new Product("Table", 100m) { Id = 2 }
            };
            _productRepositoryMock.Setup(r => r.GetAllWithDetailsAsync())
                .ReturnsAsync(products);

            var result = await _productService.GetAllProductsAsync();

            Assert.Equal(2, result.Count());
            _productRepositoryMock.Verify(r => r.GetAllWithDetailsAsync(), Times.Once);
        }

        [Fact]
        public async Task GetProductById_Exists_ReturnsProduct()
        {
            var product = new Product("Sofa", 999m) { Id = 1 };
            _productRepositoryMock.Setup(r => r.GetByIdWithDetailsAsync(1))
                .ReturnsAsync(product);
            var result = await _productService.GetProductByIdAsync(1);
            Assert.NotNull(result);
            Assert.Equal("Sofa", result.Name);
        }

        [Fact]
        public async Task GetProductById_NotFound_ReturnsNull()
        {
            _productRepositoryMock.Setup(r => r.GetByIdWithDetailsAsync(It.IsAny<int>()))
                .ReturnsAsync((Product?)null);
            var result = await _productService.GetProductByIdAsync(999);
            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteProduct_Exists_CallsDelete()
        {
            var product = new Product("ToDelete", 10m) { Id = 1 };
            _productRepositoryMock.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(product);
            _inventoryThresholdRepositoryMock.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<InventoryThreshold>());
            await _productService.DeleteProductAsync(1);
            Assert.False(product.Active);
            _productRepositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteProduct_NotFound_ThrowsKeyNotFoundException()
        {
            _mockProductRepo.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync((Product?)null);
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.DeleteProductAsync(999));
        }

        [Fact]
        public async Task CheckAvailability_SufficientStock_ReturnsTrue()
        {
            var product = new Product("InStock", 10m) { Id = 1 };
            _mockProductRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);

            var inventory = new List<Inventory>
            {
                new Inventory { ProductId = 1, Quantity = 100 }
            };
            _mockInventoryRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<Inventory, bool>>>()))
                .ReturnsAsync(inventory);
            var result = await _service.CheckAvailabilityAsync(1, 50);
            Assert.True(result);
        }

        [Fact]
        public async Task CheckAvailability_InsufficientStock_ReturnsFalse()
        {
            var product = new Product("LowStock", 10m) { Id = 1 };
            _mockProductRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);

            var inventory = new List<Inventory>
            {
                new Inventory { ProductId = 1, Quantity = 5 }
            };
            _mockInventoryRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<Inventory, bool>>>()))
                .ReturnsAsync(inventory);
            var result = await _service.CheckAvailabilityAsync(1, 10);
            Assert.False(result);
        }

        [Fact]
        public async Task GetProductsPaged_ReturnsCorrectPageAndCount()
        {
            var products = new List<Product>
            {
                new Product("P1", 10m),
                new Product("P2", 10m)
            };
            _mockProductRepo.Setup(r => r.GetProductsPagedAsync(1, 10))
                .ReturnsAsync((products, 15));

            var pagination = new PaginationParams { PageNumber = 1, PageSize = 10 };

            var (resultProducts, totalCount) = await _service.GetProductsPagedAsync(pagination);

            Assert.Equal(15, totalCount);
            Assert.Equal(2, resultProducts.Count());
            _mockProductRepo.Verify(r => r.GetProductsPagedAsync(1, 10), Times.Once);
        }
    }
}
