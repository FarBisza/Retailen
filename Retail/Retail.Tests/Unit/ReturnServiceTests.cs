using AutoMapper;
using Moq;
using Retailen.Application.DTO.Return;
using Retailen.Application.Interfaces;
using Retailen.Application.Mappings;
using Retailen.Application.Services;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.Product;
using Retailen.Domain.Enums;
using Retailen.Domain.Exceptions;
using Retailen.Domain.Interfaces;

namespace Retailen.Tests.Unit
{
    public class ReturnServiceTests
    {
        private readonly Mock<IReturnRepository> _returnRepoMock;
        private readonly Mock<IOrderRepository> _orderRepoMock;
        private readonly Mock<IInventoryService> _inventoryServiceMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly IMapper _mapper;
        private readonly ReturnService _service;

        public ReturnServiceTests()
        {
            _returnRepoMock = new Mock<IReturnRepository>();
            _orderRepoMock = new Mock<IOrderRepository>();
            _inventoryServiceMock = new Mock<IInventoryService>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();

            var config = new MapperConfiguration(cfg => cfg.AddProfile<ReturnMappingProfile>());
            _mapper = config.CreateMapper();

            _unitOfWorkMock.Setup(u => u.ExecuteInTransactionAsync(It.IsAny<Func<Task>>()))
                .Returns<Func<Task>>(action => action());

            _service = new ReturnService(
                _returnRepoMock.Object,
                _orderRepoMock.Object,
                _inventoryServiceMock.Object,
                _unitOfWorkMock.Object,
                _mapper);
        }

        [Fact]
        public async Task CreateReturn_OrderNotBelongToCustomer_ThrowsEntityNotFoundException()
        {
            var order = new Order { Id = 1, CustomerId = 999, OrderStatusId = (int)OrderStatusEnum.Delivered, Total = 200m };
            _orderRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);

            var request = new CreateReturnRequestDTO { OrderId = 1, Reason = "Defective" };
            await Assert.ThrowsAsync<EntityNotFoundException>(() => _service.CreateAsync(1, request));
        }

        [Fact]
        public async Task CreateReturn_PartialReturn_CalculatesRefundCorrectly()
        {
            var product = new Product("TestProduct", 75m) { Id = 10 };
            var orderItem = new OrderItem { Id = 101, OrderId = 1, ProductId = 10, Quantity = 3, UnitPrice = 75m, Product = product };
            var order = new Order
            {
                Id = 1,
                CustomerId = 1,
                OrderStatusId = (int)OrderStatusEnum.Delivered,
                Total = 225m,
                Items = new List<OrderItem> { orderItem }
            };

            _orderRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);
            _orderRepoMock.Setup(r => r.GetByIdWithDetailsAsync(1)).ReturnsAsync(order);
            _returnRepoMock.Setup(r => r.AddAsync(It.IsAny<Return>())).Returns(Task.CompletedTask);
            _returnRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = new CreateReturnRequestDTO
            {
                OrderId = 1,
                OrderItemId = 101,
                Quantity = 2,
                Reason = "Wrong size"
            };

            var result = await _service.CreateAsync(1, request);

            Assert.Equal(150m, result.RefundAmount);
            Assert.Equal("Pending", result.StatusName);
        }

        [Fact]
        public async Task CreateReturn_FullReturn_UsesOrderTotal()
        {
            var order = new Order { Id = 2, CustomerId = 1, OrderStatusId = (int)OrderStatusEnum.Delivered, Total = 200m };
            _orderRepoMock.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(order);
            _returnRepoMock.Setup(r => r.AddAsync(It.IsAny<Return>())).Returns(Task.CompletedTask);
            _returnRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = new CreateReturnRequestDTO
            {
                OrderId = 2,
                Quantity = 1,
                Reason = "Changed my mind"
            };

            var result = await _service.CreateAsync(1, request);

            Assert.Equal(200m, result.RefundAmount);
        }

        [Fact]
        public async Task UpdateStatus_Approved_RestoresInventoryViaService()
        {
            var product = new Product("TestProd", 30m) { Id = 10 };
            var orderItem = new OrderItem { Id = 101, OrderId = 1, ProductId = 10, Quantity = 3, UnitPrice = 30m, Product = product };
            var order = new Order
            {
                Id = 1,
                CustomerId = 1,
                Total = 90m,
                Items = new List<OrderItem> { orderItem }
            };

            var returnEntity = new Return
            {
                ReturnId = 1,
                OrderId = 1,
                CustomerId = 1,
                ReturnStatusId = (int)ReturnStatus.Pending,
                OrderItemId = 101,
                Quantity = 3,
                Reason = "Damaged",
                RefundAmount = 90m
            };

            _returnRepoMock.Setup(r => r.GetByIdWithDetailsAsync(1)).ReturnsAsync(returnEntity);
            _orderRepoMock.Setup(r => r.GetByIdWithDetailsAsync(1)).ReturnsAsync(order);
            _inventoryServiceMock.Setup(s => s.RestoreStockAsync(10, 3, 1)).Returns(Task.CompletedTask);
            _returnRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Return>())).Returns(Task.CompletedTask);
            _returnRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var updateDto = new UpdateReturnStatusDTO { ReturnStatusId = (int)ReturnStatus.Approved };
            var result = await _service.UpdateStatusAsync(1, updateDto);

            _inventoryServiceMock.Verify(s => s.RestoreStockAsync(10, 3, 1), Times.Once);
            Assert.NotNull(result.ApprovalDate);
        }

        [Fact]
        public async Task UpdateStatus_RefundCompleted_SetsRefundDate()
        {
            var returnEntity = new Return
            {
                ReturnId = 2,
                OrderId = 1,
                CustomerId = 1,
                ReturnStatusId = (int)ReturnStatus.Approved,
                Reason = "Test",
                RefundAmount = 100m
            };
            _returnRepoMock.Setup(r => r.GetByIdWithDetailsAsync(2)).ReturnsAsync(returnEntity);
            _returnRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Return>())).Returns(Task.CompletedTask);
            _returnRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var updateDto = new UpdateReturnStatusDTO { ReturnStatusId = (int)ReturnStatus.RefundCompleted };
            var result = await _service.UpdateStatusAsync(2, updateDto);

            Assert.NotNull(result.RefundDate);
            Assert.Equal("Refund Completed", result.StatusName);
        }

        [Fact]
        public async Task CancelReturn_PendingStatus_Succeeds()
        {
            var returnEntity = new Return
            {
                ReturnId = 3,
                OrderId = 1,
                CustomerId = 1,
                ReturnStatusId = (int)ReturnStatus.Pending,
                Reason = "Test"
            };
            _returnRepoMock.Setup(r => r.GetByIdAsync(3)).ReturnsAsync(returnEntity);
            _returnRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Return>())).Returns(Task.CompletedTask);
            _returnRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            await _service.CancelAsync(3, 1);

            Assert.Equal((int)ReturnStatus.Cancelled, returnEntity.ReturnStatusId);
        }

        [Fact]
        public async Task CancelReturn_NonPendingStatus_ThrowsBusinessRuleException()
        {
            var returnEntity = new Return
            {
                ReturnId = 4,
                OrderId = 1,
                CustomerId = 1,
                ReturnStatusId = (int)ReturnStatus.Approved,
                Reason = "Test"
            };
            _returnRepoMock.Setup(r => r.GetByIdAsync(4)).ReturnsAsync(returnEntity);

            await Assert.ThrowsAsync<BusinessRuleException>(
                () => _service.CancelAsync(4, 1));
        }

        [Fact]
        public async Task GetByIdAsync_ExistingReturn_ReturnsDTO()
        {
            var returnEntity = new Return
            {
                ReturnId = 5,
                OrderId = 1,
                CustomerId = 1,
                ReturnStatusId = (int)ReturnStatus.Pending,
                Reason = "Test",
                CreatedAt = DateTime.UtcNow
            };
            _returnRepoMock.Setup(r => r.GetByIdWithDetailsAsync(5)).ReturnsAsync(returnEntity);

            var result = await _service.GetByIdAsync(5);

            Assert.NotNull(result);
            Assert.Equal("Pending", result.StatusName);
        }
    }
}
