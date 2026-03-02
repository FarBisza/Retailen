using AutoMapper;
using Moq;
using Retailen.Application.DTO.Order;
using Retailen.Application.Interfaces;
using Retailen.Application.Services;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.Cart;
using Retailen.Domain.Entities.History;
using Retailen.Domain.Entities.Logistics.Deliveries.DeliveryDictionary;
using Retailen.Domain.Entities.Product;
using Retailen.Domain.Enums;
using Retailen.Domain.Exceptions;
using Retailen.Domain.Interfaces;

namespace Retailen.Tests.Unit
{
    public class OrderServiceTests
    {
        private readonly OrderService _service;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<ICartService> _cartMock;
        private readonly Mock<IOrderRepository> _orderRepoMock;
        private readonly Mock<ICartRepository> _cartRepoMock;
        private readonly Mock<IInventoryService> _inventoryServiceMock;
        private readonly Mock<IInvoiceRepository> _invoiceRepoMock;
        private readonly Mock<IRepository<Payment>> _paymentMock;
        private readonly Mock<IRepository<Shipment>> _shipmentMock;
        private readonly Mock<IRepository<ShipmentItem>> _shipmentItemMock;
        private readonly Mock<IRepository<ShipmentStatusHistory>> _shipmentStatusMock;
        private readonly Mock<IRepository<OrderStatusHistory>> _orderStatusHistoryMock;
        private readonly Mock<IRepository<OrderBillingInfo>> _billingMock;
        private readonly Mock<IRepository<Return>> _returnMock;
        private readonly Mock<IRepository<Review>> _reviewMock;
        private readonly Mock<IEmailService> _emailMock;

        public OrderServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _mapperMock = new Mock<IMapper>();
            _cartMock = new Mock<ICartService>();
            _orderRepoMock = new Mock<IOrderRepository>();
            _cartRepoMock = new Mock<ICartRepository>();
            _inventoryServiceMock = new Mock<IInventoryService>();
            _invoiceRepoMock = new Mock<IInvoiceRepository>();
            _paymentMock = new Mock<IRepository<Payment>>();
            _shipmentMock = new Mock<IRepository<Shipment>>();
            _shipmentItemMock = new Mock<IRepository<ShipmentItem>>();
            _shipmentStatusMock = new Mock<IRepository<ShipmentStatusHistory>>();
            _orderStatusHistoryMock = new Mock<IRepository<OrderStatusHistory>>();
            _billingMock = new Mock<IRepository<OrderBillingInfo>>();
            _returnMock = new Mock<IRepository<Return>>();
            _reviewMock = new Mock<IRepository<Review>>();
            _emailMock = new Mock<IEmailService>();

            _mapperMock.Setup(m => m.Map<OrderDTO>(It.IsAny<Order>()))
                .Returns((Order o) => new OrderDTO
                {
                    Id = o.Id,
                    Total = o.Total,
                    StatusId = o.OrderStatusId,
                    Items = new List<OrderItemDTO>()
                });

            _orderRepoMock.Setup(r => r.AddAsync(It.IsAny<Order>())).Returns(Task.CompletedTask);
            _orderRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);
            _cartRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Cart>())).Returns(Task.CompletedTask);
            _unitOfWorkMock.Setup(u => u.BeginTransactionAsync()).ReturnsAsync(Mock.Of<IAsyncDisposable>());
            _unitOfWorkMock.Setup(u => u.CommitTransactionAsync()).Returns(Task.CompletedTask);
            _unitOfWorkMock.Setup(u => u.RollbackTransactionAsync()).Returns(Task.CompletedTask);

            _service = new OrderService(
                _unitOfWorkMock.Object, _mapperMock.Object, _cartMock.Object,
                _orderRepoMock.Object, _cartRepoMock.Object,
                _inventoryServiceMock.Object, _invoiceRepoMock.Object,
                _paymentMock.Object,
                _shipmentMock.Object, _shipmentItemMock.Object,
                _shipmentStatusMock.Object, _orderStatusHistoryMock.Object,
                _billingMock.Object, _returnMock.Object, _reviewMock.Object,
                _emailMock.Object);
        }

        private Cart BuildCartWithItems(int customerId, params (string name, decimal price, int qty)[] items)
        {
            var cart = new Cart(customerId, $"sess-{customerId}");
            var productId = 1;

            foreach (var (name, price, qty) in items)
            {
                var product = new Product(name, price) { Id = productId++ };

                cart.AddItem(product.Id, qty);
                var cartItem = cart.Items.Last();
                cartItem.Product = product;
            }

            return cart;
        }

        [Fact]
        public async Task CreateOrder_EmptyCart_ThrowsArgumentException()
        {
            var cart = new Cart(1, "sess-1");
            _cartRepoMock.Setup(r => r.GetCartWithItemsAsync(cart.Id)).ReturnsAsync(cart);

            var request = new CreateOrderRequestDTO { UserId = 1, CartId = cart.Id };
            await Assert.ThrowsAsync<BusinessRuleException>(() => _service.CreateOrderAsync(request));
        }

        [Fact]
        public async Task CreateOrder_CartNotFound_ThrowsBusinessRuleException()
        {
            _cartRepoMock.Setup(r => r.GetCartWithItemsAsync(999)).ReturnsAsync((Cart?)null);

            var request = new CreateOrderRequestDTO { UserId = 1, CartId = 999 };
            await Assert.ThrowsAsync<BusinessRuleException>(() => _service.CreateOrderAsync(request));
        }

        [Fact]
        public async Task CreateOrder_CartBelongsToDifferentUser_ThrowsUnauthorizedAccess()
        {
            var cart = BuildCartWithItems(5, ("Product", 50m, 1));
            _cartRepoMock.Setup(r => r.GetCartWithItemsAsync(cart.Id)).ReturnsAsync(cart);

            var request = new CreateOrderRequestDTO { UserId = 999, CartId = cart.Id }; // wrong user
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.CreateOrderAsync(request));
        }

        [Fact]
        public async Task CreateOrder_CalculatesTotalCorrectly()
        {
            var cart = BuildCartWithItems(2, ("P1", 100m, 2), ("P2", 25.50m, 3));
            _cartRepoMock.Setup(r => r.GetCartWithItemsAsync(cart.Id)).ReturnsAsync(cart);

            var request = new CreateOrderRequestDTO { UserId = 2, CartId = cart.Id };
            var result = await _service.CreateOrderAsync(request);

            Assert.Equal(276.50m, result.Total);
        }

        [Fact]
        public async Task CreateOrder_DeactivatesCart()
        {
            var cart = BuildCartWithItems(3, ("Product", 50m, 1));
            _cartRepoMock.Setup(r => r.GetCartWithItemsAsync(cart.Id)).ReturnsAsync(cart);

            var request = new CreateOrderRequestDTO { UserId = 3, CartId = cart.Id };
            await _service.CreateOrderAsync(request);

            Assert.False(cart.Active);
        }

        [Fact]
        public async Task CreateOrder_SetsStatusToAwaitingPayment()
        {
            var cart = BuildCartWithItems(4, ("Product", 50m, 1));
            _cartRepoMock.Setup(r => r.GetCartWithItemsAsync(cart.Id)).ReturnsAsync(cart);

            var request = new CreateOrderRequestDTO { UserId = 4, CartId = cart.Id };
            var result = await _service.CreateOrderAsync(request);

            Assert.Equal((int)OrderStatusEnum.AwaitingPayment, result.StatusId);
        }

        [Fact]
        public async Task CreateOrder_SnapshotsProductPrice()
        {
            var cart = BuildCartWithItems(6, ("SnapProduct", 150m, 1));
            _cartRepoMock.Setup(r => r.GetCartWithItemsAsync(cart.Id)).ReturnsAsync(cart);

            var request = new CreateOrderRequestDTO { UserId = 6, CartId = cart.Id };
            var result = await _service.CreateOrderAsync(request);

            Assert.Equal(150m, result.Total);
        }
    }
}
