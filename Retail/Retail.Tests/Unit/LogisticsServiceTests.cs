using Moq;
using Retailen.Application.DTO.Logistics;
using Retailen.Application.Interfaces;
using Retailen.Application.Services;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.Logistics;
using Retailen.Domain.Entities.Logistics.Deliveries.Supplier;
using Retailen.Domain.Entities.Logistics.Deliveries.DeliveryDictionary;
using Retailen.Domain.Entities.Logistics.GoodsReceipt;
using Retailen.Domain.Enums;
using Retailen.Domain.Interfaces;

namespace Retailen.Tests.Unit
{
    public class LogisticsServiceTests
    {
        private readonly Mock<IRepository<Supplier>> _supplierRepoMock;
        private readonly Mock<IRepository<Warehouse>> _warehouseRepoMock;
        private readonly Mock<IPurchaseOrderRepository> _poRepoMock;
        private readonly Mock<IGoodsReceiptRepository> _grRepoMock;
        private readonly Mock<IShipmentRepository> _shipmentRepoMock;
        private readonly Mock<IInventoryService> _inventoryServiceMock;
        private readonly Mock<IRepository<GoodsReceiptDiscrepancy>> _discrepancyRepoMock;
        private readonly Mock<IRepository<ShipmentStatusHistory>> _shipmentStatusRepoMock;
        private readonly Mock<IOrderRepository> _orderRepoMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly LogisticsService _service;

        public LogisticsServiceTests()
        {
            _supplierRepoMock = new Mock<IRepository<Supplier>>();
            _warehouseRepoMock = new Mock<IRepository<Warehouse>>();
            _poRepoMock = new Mock<IPurchaseOrderRepository>();
            _grRepoMock = new Mock<IGoodsReceiptRepository>();
            _shipmentRepoMock = new Mock<IShipmentRepository>();
            _inventoryServiceMock = new Mock<IInventoryService>();
            _discrepancyRepoMock = new Mock<IRepository<GoodsReceiptDiscrepancy>>();
            _shipmentStatusRepoMock = new Mock<IRepository<ShipmentStatusHistory>>();
            _orderRepoMock = new Mock<IOrderRepository>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();

            _unitOfWorkMock.Setup(u => u.ExecuteInTransactionAsync(It.IsAny<Func<Task>>()))
                .Returns<Func<Task>>(action => action());

            _service = new LogisticsService(
                _supplierRepoMock.Object,
                _warehouseRepoMock.Object,
                _poRepoMock.Object,
                _grRepoMock.Object,
                _shipmentRepoMock.Object,
                _inventoryServiceMock.Object,
                _discrepancyRepoMock.Object,
                _shipmentStatusRepoMock.Object,
                _orderRepoMock.Object,
                _unitOfWorkMock.Object);
        }

        [Fact]
        public async Task CreateSupplier_Valid_ReturnsSupplierDTO()
        {
            var dto = new CreateSupplierRequestDTO { Name = "Test Supplier", Email = "supplier@test.com", Phone = "555-1234" };

            _supplierRepoMock.Setup(r => r.AddAsync(It.IsAny<Supplier>()))
                .Returns(Task.CompletedTask)
                .Callback<Supplier>(s => s.Id = 1);
            _supplierRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var result = await _service.CreateSupplierAsync(dto);

            Assert.Equal("Test Supplier", result.Name);
            Assert.Equal("supplier@test.com", result.Email);
            Assert.True(result.Active);
            _supplierRepoMock.Verify(r => r.AddAsync(It.IsAny<Supplier>()), Times.Once);
            _supplierRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteSupplier_NotFound_ReturnsFalse()
        {
            _supplierRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync((Supplier?)null);

            var result = await _service.DeleteSupplierAsync(999);

            Assert.False(result);
        }

        [Fact]
        public async Task CreatePurchaseOrder_Valid_ReturnsPO()
        {
            var dto = new CreateSupplyOrderRequestDTO
            {
                SupplierId = 1,
                WarehouseId = 1,
                ExpectedDate = DateTime.UtcNow.AddDays(7),
                Comment = "Test order",
                Items = new List<SupplyOrderLineDTO>
                {
                    new SupplyOrderLineDTO { ProductId = 1, QuantityOrdered = 100, PurchasePrice = 50m }
                }
            };

            _poRepoMock.Setup(r => r.AddAsync(It.IsAny<PurchaseOrder>()))
                .Returns(Task.CompletedTask)
                .Callback<PurchaseOrder>(po => po.Id = 1);
            _poRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var result = await _service.CreatePurchaseOrderAsync(dto);

            Assert.Equal(1, result.SupplyOrderId);
            _poRepoMock.Verify(r => r.AddAsync(It.Is<PurchaseOrder>(po =>
                po.SupplierId == 1 &&
                po.Items.Count == 1 &&
                po.Items.First().QuantityOrdered == 100
            )), Times.Once);
        }

        [Fact]
        public async Task ConfirmOrderBySupplier_WrongSupplier_ReturnsFalse()
        {
            var po = new PurchaseOrder { Id = 1, SupplierId = 5, StatusId = (int)PurchaseOrderStatusEnum.Submitted };
            _poRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(po);

            var result = await _service.ConfirmOrderBySupplierAsync(1, 999);

            Assert.False(result);
        }

        [Fact]
        public async Task CreateGoodsReceipt_UpdatesInventory()
        {
            var po = new PurchaseOrder
            {
                Id = 1, SupplierId = 1, WarehouseId = 1,
                StatusId = (int)PurchaseOrderStatusEnum.Confirmed,
                Items = new List<PurchaseOrderItem>
                {
                    new PurchaseOrderItem { ProductId = 10, QuantityOrdered = 20 }
                }
            };
            _poRepoMock.Setup(r => r.GetByIdWithDetailsAsync(1)).ReturnsAsync(po);

            _inventoryServiceMock.Setup(s => s.AddStockAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);

            _grRepoMock.Setup(r => r.AddAsync(It.IsAny<GoodsReceipt>())).Returns(Task.CompletedTask);
            _grRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);
            _poRepoMock.Setup(r => r.UpdateAsync(It.IsAny<PurchaseOrder>())).Returns(Task.CompletedTask);
            _poRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var dto = new ReceiveGoodsRequestDTO
            {
                WarehouseId = 1,
                DocumentNumber = "PZ-001",
                ShippingCost = 50m,
                Comment = "Test receipt",
                Items = new List<ReceiveGoodsLineDto>
                {
                    new ReceiveGoodsLineDto { ProductId = 10, QuantityReceived = 20, QuantityDamaged = 2 }
                }
            };

            var result = await _service.CreateGoodsReceiptAsync(1, dto);

            Assert.NotNull(result);

            _inventoryServiceMock.Verify(s => s.AddStockAsync(10, 18, 1), Times.Once);
        }
    }
}
