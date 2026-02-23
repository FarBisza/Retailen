using AutoMapper;
using Moq;
using Retailen.Application.DTO.Cart;
using Retailen.Application.Interfaces;
using Retailen.Application.Services;
using Retailen.Domain.Entities.Cart;
using Retailen.Domain.Entities.Product;
using Retailen.Domain.Interfaces;

namespace Retailen.Tests.Unit
{
    public class CartServiceTests
    {
        private readonly CartService _service;
        private readonly Mock<ICartRepository> _cartRepoMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IProductService> _productMock;

        public CartServiceTests()
        {
            _cartRepoMock = new Mock<ICartRepository>();
            _mapperMock = new Mock<IMapper>();
            _productMock = new Mock<IProductService>();
            _service = new CartService(_cartRepoMock.Object, _mapperMock.Object, _productMock.Object);
        }

        [Fact]
        public async Task AddToCart_WithZeroQuantity_ThrowsArgumentException()
        {
            var request = new AddToCartRequestDTO { ProductId = 1, Quantity = 0, SessionId = "sess" };
            await Assert.ThrowsAsync<ArgumentException>(() => _service.AddToCartAsync(request));
        }

        [Fact]
        public async Task AddToCart_NegativeQuantity_ThrowsArgumentException()
        {
            var request = new AddToCartRequestDTO { ProductId = 1, Quantity = -5, SessionId = "sess" };
            await Assert.ThrowsAsync<ArgumentException>(() => _service.AddToCartAsync(request));
        }

        [Fact]
        public async Task AddToCart_UnavailableProduct_ThrowsInvalidOperationException()
        {
            _productMock.Setup(p => p.CheckAvailabilityAsync(1, 2)).ReturnsAsync(false);

            _cartRepoMock.Setup(r => r.GetActiveCartBySessionAsync(It.IsAny<string>()))
                .ReturnsAsync((Cart?)null);
            _cartRepoMock.Setup(r => r.GetActiveCartByCustomerAsync(It.IsAny<int>()))
                .ReturnsAsync((Cart?)null);

            var request = new AddToCartRequestDTO { ProductId = 1, Quantity = 2, SessionId = "sess-1" };
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.AddToCartAsync(request));
        }

        [Fact]
        public async Task AddToCart_NewItem_CreatesCartAndAddsItem()
        {
            _productMock.Setup(p => p.CheckAvailabilityAsync(1, 2)).ReturnsAsync(true);
            _cartRepoMock.Setup(r => r.GetActiveCartByCustomerAsync(10))
                .ReturnsAsync((Cart?)null);
            _cartRepoMock.Setup(r => r.AddAsync(It.IsAny<Cart>())).Returns(Task.CompletedTask);
            _cartRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = new AddToCartRequestDTO { CustomerId = 10, SessionId = "new-sess", ProductId = 1, Quantity = 2 };
            await _service.AddToCartAsync(request);

            _cartRepoMock.Verify(r => r.AddAsync(It.Is<Cart>(c =>
                c.CustomerId == 10 &&
                c.Items.Count == 1 &&
                c.Items.First().Quantity == 2
            )), Times.Once);
        }

        [Fact]
        public async Task AddToCart_ExistingItem_IncreasesQuantity()
        {
            var cart = new Cart(5, "sess-5");
            cart.AddItem(1, 3);
            _cartRepoMock.Setup(r => r.GetActiveCartByCustomerAsync(5)).ReturnsAsync(cart);
            _productMock.Setup(p => p.CheckAvailabilityAsync(1, It.IsAny<int>())).ReturnsAsync(true);
            _cartRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Cart>())).Returns(Task.CompletedTask);
            _cartRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = new AddToCartRequestDTO { CustomerId = 5, SessionId = "sess-5", ProductId = 1, Quantity = 2 };
            await _service.AddToCartAsync(request);

            var item = cart.Items.First(i => i.ProductId == 1);
            Assert.Equal(5, item.Quantity);
        }

        [Fact]
        public async Task UpdateQuantity_CartNotFound_ThrowsArgumentException()
        {
            _cartRepoMock.Setup(r => r.GetCartWithItemsAsync(999)).ReturnsAsync((Cart?)null);

            var request = new UpdateQuantityRequestDTO { CartId = 999, ItemId = 1, NewQuantity = 5 };
            await Assert.ThrowsAsync<ArgumentException>(
                () => _service.UpdateQuantityAsync(request, null, "sess"));
        }

        [Fact]
        public async Task RemoveFromCart_ExistingItem_RemovesIt()
        {
            var cart = new Cart(7, "sess-7");
            cart.AddItem(1, 2);
            var itemId = cart.Items.First().Id;
            _cartRepoMock.Setup(r => r.GetCartWithItemsAsync(cart.Id)).ReturnsAsync(cart);
            _cartRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Cart>())).Returns(Task.CompletedTask);
            _cartRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            await _service.RemoveFromCartAsync(cart.Id, itemId, 7, "sess-7");

            Assert.Empty(cart.Items);
        }

        [Fact]
        public async Task ClearCart_RemovesAllItems()
        {
            var cart = new Cart(8, "sess-8");
            cart.AddItem(1, 1);
            cart.AddItem(2, 3);
            _cartRepoMock.Setup(r => r.GetCartWithItemsAsync(cart.Id)).ReturnsAsync(cart);
            _cartRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Cart>())).Returns(Task.CompletedTask);
            _cartRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            await _service.ClearCartAsync(cart.Id, 8, "sess-8");

            Assert.Empty(cart.Items);
        }

        [Fact]
        public async Task FinalizeCart_DeactivatesCart()
        {
            var cart = new Cart(9, "sess-9");
            _cartRepoMock.Setup(r => r.GetByIdAsync(cart.Id)).ReturnsAsync(cart);
            _cartRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Cart>())).Returns(Task.CompletedTask);
            _cartRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            await _service.FinalizeCartAsync(cart.Id);

            Assert.False(cart.Active);
        }
    }
}
