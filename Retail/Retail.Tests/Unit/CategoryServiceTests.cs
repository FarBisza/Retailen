using Moq;
using Retailen.Application.Services;
using Retailen.Domain.Entities.Product;
using Retailen.Domain.Interfaces;

namespace Retailen.Tests.Unit
{
    public class CategoryServiceTests
    {
        private readonly Mock<IRepository<Category>> _categoryRepoMock;
        private readonly CategoryService _service;

        public CategoryServiceTests()
        {
            _categoryRepoMock = new Mock<IRepository<Category>>();
            _service = new CategoryService(_categoryRepoMock.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsList()
        {
            var categories = new List<Category>
            {
                new Category("Living Room", null),
                new Category("Bedroom", null),
                new Category("Kitchen", null)
            };
            _categoryRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(categories);

            var result = await _service.GetAllCategoriesAsync();
            Assert.Equal(3, result.Count());
        }

        [Fact]
        public async Task GetById_Exists_ReturnsDTO()
        {
            var cat = new Category("Dining", null);
            _categoryRepoMock.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(cat);

            var result = await _service.GetCategoryByIdAsync(10);

            Assert.NotNull(result);
            Assert.Equal("Dining", result.Name);
        }

        [Fact]
        public async Task GetById_NotFound_ReturnsNull()
        {
            _categoryRepoMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Category?)null);

            var result = await _service.GetCategoryByIdAsync(999);
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateCategory_SavesAndReturns()
        {
            _categoryRepoMock.Setup(r => r.AddAsync(It.IsAny<Category>())).Returns(Task.CompletedTask);
            _categoryRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var result = await _service.CreateCategoryAsync("New Category", null);

            Assert.NotNull(result);
            Assert.Equal("New Category", result.Name);
            _categoryRepoMock.Verify(r => r.AddAsync(It.IsAny<Category>()), Times.Once);
        }

        [Fact]
        public async Task CreateCategory_WithParent_SetsParentId()
        {
            _categoryRepoMock.Setup(r => r.AddAsync(It.IsAny<Category>())).Returns(Task.CompletedTask);
            _categoryRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var result = await _service.CreateCategoryAsync("Child Category", 5);

            Assert.NotNull(result);
            Assert.Equal(5, result.ParentId);
        }
    }
}
