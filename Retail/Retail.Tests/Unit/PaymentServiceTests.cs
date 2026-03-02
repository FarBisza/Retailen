using Moq;
using Retailen.Application.Interfaces;
using Retailen.Application.Services;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.History;
using Retailen.Domain.Entities.Product;
using Retailen.Domain.Enums;
using Retailen.Domain.Interfaces;

namespace Retailen.Tests.Unit
{
    public class PaymentServiceTests
    {
        private readonly PaymentService _service;
        private readonly Mock<IOrderRepository> _orderRepoMock;
        private readonly Mock<IInvoiceRepository> _invoiceRepoMock;
        private readonly Mock<IInventoryRepository> _inventoryRepoMock;
        private readonly Mock<IRepository<Payment>> _paymentRepoMock;
        private readonly Mock<IRepository<InventoryHistory>> _whHistoryRepoMock;
        private readonly Mock<IProductService> _productMock;

        public PaymentServiceTests()
        {
            _orderRepoMock = new Mock<IOrderRepository>();
            _invoiceRepoMock = new Mock<IInvoiceRepository>();
            _inventoryRepoMock = new Mock<IInventoryRepository>();
            _paymentRepoMock = new Mock<IRepository<Payment>>();
            _whHistoryRepoMock = new Mock<IRepository<InventoryHistory>>();
            _productMock = new Mock<IProductService>();

            _invoiceRepoMock.Setup(r => r.AddAsync(It.IsAny<Invoice>())).Returns(Task.CompletedTask);
            _invoiceRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);
            _paymentRepoMock.Setup(r => r.AddAsync(It.IsAny<Payment>())).Returns(Task.CompletedTask);
            _paymentRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);
            _whHistoryRepoMock.Setup(r => r.AddAsync(It.IsAny<InventoryHistory>())).Returns(Task.CompletedTask);

            _service = new PaymentService(
                _orderRepoMock.Object, _invoiceRepoMock.Object,
                _inventoryRepoMock.Object, _paymentRepoMock.Object,
                _whHistoryRepoMock.Object, _productMock.Object);
        }

        [Fact]
        public async Task GenerateInvoice_OrderNotFound_ThrowsArgument()
        {
            _orderRepoMock.Setup(r => r.GetByIdWithDetailsAsync(999))
                .ReturnsAsync((Order?)null);

            await Assert.ThrowsAsync<ArgumentException>(
                () => _service.GenerateInvoiceAsync(999));
        }

        [Fact]
        public async Task GenerateInvoice_AlreadyExists_ThrowsInvalidOperation()
        {
            var order = new Order
            {
                Id = 1, CustomerId = 1, Total = 200m,
                OrderStatusId = (int)OrderStatusEnum.AwaitingPayment,
                Items = new List<OrderItem> { new() { ProductId = 1, Quantity = 2, UnitPrice = 100m } },
                Invoices = new List<Invoice> { new() { Id = 1 } }
            };
            _orderRepoMock.Setup(r => r.GetByIdWithDetailsAsync(1)).ReturnsAsync(order);

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _service.GenerateInvoiceAsync(1));
        }

        [Fact]
        public async Task GenerateInvoice_Valid_CreatesInvoice()
        {
            var order = new Order
            {
                Id = 1, CustomerId = 1, Total = 150m,
                OrderStatusId = (int)OrderStatusEnum.AwaitingPayment,
                Items = new List<OrderItem> { new() { ProductId = 1, Quantity = 3, UnitPrice = 50m } },
                Invoices = new List<Invoice>()
            };
            _orderRepoMock.Setup(r => r.GetByIdWithDetailsAsync(1)).ReturnsAsync(order);

            var invoice = await _service.GenerateInvoiceAsync(1);

            Assert.NotNull(invoice);
            Assert.Equal(1, invoice.OrderId);
            Assert.Equal(150m, invoice.Amount);
            Assert.Equal((int)InvoiceStatusEnum.Pending, invoice.InvoiceStatusId);
            _invoiceRepoMock.Verify(r => r.AddAsync(It.IsAny<Invoice>()), Times.Once);
            _invoiceRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task RegisterPayment_InvoiceNotFound_ThrowsArgument()
        {
            _invoiceRepoMock.Setup(r => r.GetByIdWithOrderDetailsAsync(999))
                .ReturnsAsync((Invoice?)null);

            await Assert.ThrowsAsync<ArgumentException>(
                () => _service.RegisterPaymentAsync(999, 100m, 1));
        }

        [Fact]
        public async Task RegisterPayment_AlreadyPaid_ThrowsInvalidOperation()
        {
            var invoice = new Invoice
            {
                Id = 1, OrderId = 1, InvoiceStatusId = (int)InvoiceStatusEnum.Paid, Amount = 200m,
                Order = new Order { Id = 1, Items = new List<OrderItem>() }
            };
            _invoiceRepoMock.Setup(r => r.GetByIdWithOrderDetailsAsync(1)).ReturnsAsync(invoice);

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _service.RegisterPaymentAsync(1, 200m, 1));
        }

        [Fact]
        public async Task RegisterPayment_InsufficientStock_ThrowsInvalidOperation()
        {
            var product = new Product("Test", 100m) { Id = 10 };
            var invoice = new Invoice
            {
                Id = 1, OrderId = 1, InvoiceStatusId = (int)InvoiceStatusEnum.Pending, Amount = 500m,
                Order = new Order
                {
                    Id = 1, OrderStatusId = (int)OrderStatusEnum.AwaitingPayment,
                    Items = new List<OrderItem> { new() { ProductId = 10, Quantity = 5, UnitPrice = 100m, Product = product } }
                }
            };
            _invoiceRepoMock.Setup(r => r.GetByIdWithOrderDetailsAsync(1)).ReturnsAsync(invoice);
            _inventoryRepoMock.Setup(r => r.GetByProductAndWarehouseAsync(10, 1))
                .ReturnsAsync(new Inventory { ProductId = 10, WarehouseId = 1, Quantity = 2 });

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _service.RegisterPaymentAsync(1, 500m, 1));
        }

        [Fact]
        public async Task RegisterPayment_Valid_DeductsStockAndPays()
        {
            var product = new Product("Test", 100m) { Id = 10 };
            var inventory = new Inventory { ProductId = 10, WarehouseId = 1, Quantity = 50 };
            var invoice = new Invoice
            {
                Id = 1, OrderId = 1, InvoiceStatusId = (int)InvoiceStatusEnum.Pending, Amount = 200m,
                Order = new Order
                {
                    Id = 1, Total = 200m, OrderStatusId = (int)OrderStatusEnum.AwaitingPayment,
                    Items = new List<OrderItem> { new() { ProductId = 10, Quantity = 2, UnitPrice = 100m, Product = product } }
                }
            };
            _invoiceRepoMock.Setup(r => r.GetByIdWithOrderDetailsAsync(1)).ReturnsAsync(invoice);
            _inventoryRepoMock.Setup(r => r.GetByProductAndWarehouseAsync(10, 1)).ReturnsAsync(inventory);

            var payment = await _service.RegisterPaymentAsync(1, 200m, 1);

            Assert.NotNull(payment);
            Assert.Equal(200m, payment.Amount);
            Assert.Equal(48, inventory.Quantity);
            Assert.Equal((int)InvoiceStatusEnum.Paid, invoice.InvoiceStatusId);
            _paymentRepoMock.Verify(r => r.AddAsync(It.IsAny<Payment>()), Times.Once);
        }
    }
}
