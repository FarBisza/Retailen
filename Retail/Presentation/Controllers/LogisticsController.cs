// Zmienione EN
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Retailen.Application.DTO.Logistics;
using Retailen.Application.Interfaces;
using Retailen.Application.Pagination;

namespace Retailen.Presentation.Controllers;

[Route("api/logistics")]
[Authorize]
public class LogisticsController : BaseApiController
{
    private readonly ILogisticsService _service;

    public LogisticsController(ILogisticsService service)
    {
        _service = service;
    }

    [HttpGet("suppliers")]
    [Authorize(Policy = "RequireStaff")]
    public async Task<IActionResult> GetSuppliers()
    {
        var list = await _service.GetSuppliersAsync();
        return Ok(list);
    }

    [HttpPost("suppliers")]
    [Authorize(Policy = "RequireStaff")]
    public async Task<IActionResult> CreateSupplier([FromBody] CreateSupplierRequestDTO req)
    {
        var supplier = await _service.CreateSupplierAsync(req);
        return Ok(supplier);
    }

    [HttpGet("warehouses")]
    [Authorize(Policy = "RequireStaff")]
    public async Task<IActionResult> GetWarehouses()
    {
        var list = await _service.GetWarehousesAsync();
        return Ok(list);
    }

    [HttpPost("thresholds")]
    [Authorize(Policy = "RequireStaff")]
    public async Task<IActionResult> SetInventoryThreshold([FromBody] UpdateInventoryThresholdDTO req)
    {
        var success = await _service.SetInventoryThresholdAsync(req);
        if (!success) return BadRequest(new { message = "Failed to update threshold" });
        return Ok(new { message = "Threshold updated successfully" });
    }

    [HttpGet("supply-orders")]
    [Authorize(Policy = "RequireStaff")]
    public async Task<IActionResult> GetSupplyOrders([FromQuery] int? page = null, [FromQuery] int? pageSize = null)
    {
        if (page.HasValue || pageSize.HasValue)
        {
            var pagination = new PaginationParams
            {
                PageNumber = page ?? 1,
                PageSize = pageSize ?? 10
            };
            var paged = await _service.GetPurchaseOrdersPagedAsync(pagination);
            return Ok(paged);
        }
        var list = await _service.GetPurchaseOrdersAsync();
        return Ok(list);
    }

    [HttpGet("low-stock")]
    [Authorize(Policy = "RequireStaff")]
    public async Task<IActionResult> GetLowStockProducts(
        [FromQuery] int? warehouseId,
        [FromServices] Retailen.Domain.Interfaces.IRepository<Retailen.Domain.Entities.Product.Product> productRepository,
        [FromServices] Retailen.Domain.Interfaces.IRepository<Retailen.Domain.Entities.Inventory> inventoryRepository,
        [FromServices] Retailen.Domain.Interfaces.IRepository<Retailen.Domain.Entities.InventoryThreshold> thresholdRepository,
        [FromServices] Retailen.Domain.Interfaces.IRepository<Retailen.Domain.Entities.Logistics.Warehouse> warehouseRepository)
    {
        var products = await productRepository.GetAllAsync();
        var inventory = await inventoryRepository.GetAllAsync();
        var thresholds = await thresholdRepository.GetAllAsync();
        var warehouses = await warehouseRepository.GetAllAsync();

        // We must query from thresholds (or products), left joining inventory.
        // If we start from inventory, products with 0 stock (no inventory record) are completely ignored!
        var query = from t in thresholds
                    join p in products on t.ProductId equals p.Id
                    join w in warehouses on t.WarehouseId equals w.Id
                    join i in inventory on new { t.ProductId, t.WarehouseId } equals new { i.ProductId, i.WarehouseId } into invJoin
                    from i in invJoin.DefaultIfEmpty()
                    let currentStock = i != null ? i.Quantity : 0
                    where t.LowStockThreshold > 0 && currentStock <= t.LowStockThreshold
                    where !warehouseId.HasValue || t.WarehouseId == warehouseId.Value
                    select new ProductLowStockDTO
                    {
                        ProductId = p.Id,
                        ProductName = p.Name,
                        WarehouseId = w.Id,
                        WarehouseName = w.Name,
                        CurrentStock = currentStock,
                        Threshold = t.LowStockThreshold,
                        SuggestedOrderQuantity = (t.LowStockThreshold * 2) - currentStock > 0 ? (t.LowStockThreshold * 2) - currentStock : 10
                    };

        return Ok(query.ToList());
    }

    [HttpGet("product-inventory/{productId}")]
    [Authorize(Policy = "RequireStaff")]
    public async Task<IActionResult> GetProductInventory(
        int productId,
        [FromServices] Retailen.Domain.Interfaces.IRepository<Retailen.Domain.Entities.Inventory> inventoryRepository,
        [FromServices] Retailen.Domain.Interfaces.IRepository<Retailen.Domain.Entities.InventoryThreshold> thresholdRepository,
        [FromServices] Retailen.Domain.Interfaces.IRepository<Retailen.Domain.Entities.Logistics.Warehouse> warehouseRepository)
    {
        var inventory = await inventoryRepository.FindAsync(i => i.ProductId == productId);
        var thresholds = await thresholdRepository.FindAsync(t => t.ProductId == productId);
        var warehouses = await warehouseRepository.GetAllAsync();

        var result = warehouses.Select(w => new
        {
            WarehouseId = w.Id,
            WarehouseName = w.Name,
            Stock = inventory.FirstOrDefault(i => i.WarehouseId == w.Id)?.Quantity ?? 0,
            Threshold = thresholds.FirstOrDefault(t => t.WarehouseId == w.Id)?.LowStockThreshold ?? 0
        }).ToList();

        return Ok(result);
    }

    [HttpPost("supply-orders")]
    [Authorize(Policy = "RequireStaff")]
    public async Task<IActionResult> CreateSupplyOrder([FromBody] CreateSupplyOrderRequestDTO req)
    {
        var result = await _service.CreatePurchaseOrderAsync(req);
        return Ok(result);
    }

    [HttpPost("supply-orders/{supplyOrderId:int}/cancel")]
    [Authorize(Policy = "RequireStaff")]
    public async Task<IActionResult> CancelSupplyOrder(int supplyOrderId)
    {
        var success = await _service.CancelPurchaseOrderAsync(supplyOrderId);
        if (!success) return BadRequest(new { message = "Failed to cancel supply order" });
        return Ok(new { message = "Supply order cancelled" });
    }

    [HttpGet("goods-receipts")]
    [Authorize(Policy = "RequireStaff")]
    public async Task<IActionResult> GetGoodsReceipts()
    {
        var list = await _service.GetGoodsReceiptsAsync();
        return Ok(list);
    }

    [HttpPost("supply-orders/{supplyOrderId:int}/receive")]
    [Authorize(Policy = "RequireStaff")]
    public async Task<IActionResult> ReceiveGoods(int supplyOrderId, [FromBody] ReceiveGoodsRequestDTO req)
    {
        try
        {
            var result = await _service.CreateGoodsReceiptAsync(supplyOrderId, req);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("shipments")]
    [Authorize(Policy = "RequireStaff")]
    public async Task<IActionResult> GetShipments([FromQuery] int? page = null, [FromQuery] int? pageSize = null)
    {
        if (page.HasValue || pageSize.HasValue)
        {
            var pagination = new PaginationParams
            {
                PageNumber = page ?? 1,
                PageSize = pageSize ?? 10
            };
            var paged = await _service.GetShipmentsPagedAsync(pagination);
            return Ok(paged);
        }
        var list = await _service.GetShipmentsAsync();
        return Ok(list);
    }

    [HttpGet("orders/{orderId:int}/shipments")]
    [Authorize(Policy = "RequireStaff")]
    public async Task<IActionResult> GetShipmentsForOrder(int orderId)
    {
        var list = await _service.GetShipmentsForOrderAsync(orderId);
        return Ok(list);
    }

    [HttpPost("orders/{orderId:int}/shipments")]
    [Authorize(Policy = "RequireStaff")]
    public async Task<IActionResult> CreateShipment(int orderId, [FromQuery] int warehouseId, [FromBody] CreateShipmentRequestDTO req)
    {
        try
        {
            var result = await _service.CreateShipmentAsync(orderId, warehouseId, req);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("shipments/{shipmentId:int}/ship")]
    [Authorize(Policy = "RequireStaff")]
    public async Task<IActionResult> MarkShipped(int shipmentId, [FromBody] MarkShippedRequestDTO req)
    {
        var result = await _service.MarkShippedAsync(shipmentId, req);
        if (!result) return NotFound(new { message = "Shipment not found" });
        return Ok(new { message = "Shipment dispatched" });
    }

    [HttpPost("shipments/{shipmentId:int}/deliver")]
    [Authorize(Policy = "RequireStaff")]
    public async Task<IActionResult> MarkDelivered(int shipmentId, [FromBody] MarkDeliveredRequestDTO req)
    {
        var result = await _service.MarkDeliveredAsync(shipmentId, req);
        if (!result) return NotFound(new { message = "Shipment not found" });
        return Ok(new { message = "Shipment delivered" });
    }

    [HttpGet("supplier/supply-orders")]
    [Authorize(Policy = "RequireSupplier")]
    public async Task<IActionResult> GetSupplyOrdersForSupplier()
    {
        var list = await _service.GetPurchaseOrdersAsync();
        return Ok(list);
    }

    [HttpGet("supplier/shipments")]
    [Authorize(Policy = "RequireSupplier")]
    public async Task<IActionResult> GetShipmentsForSupplier()
    {
        var list = await _service.GetShipmentsAsync();
        return Ok(list);
    }

    [HttpPost("supplier/{supplierId:int}/orders/{orderId:int}/confirm")]
    [Authorize(Policy = "RequireSupplier")]
    public async Task<IActionResult> ConfirmOrder(int supplierId, int orderId)
    {
        var success = await _service.ConfirmOrderBySupplierAsync(orderId, supplierId);
        if (!success) return BadRequest(new { message = "Failed to confirm order" });
        return Ok(new { message = "Order confirmed" });
    }

    [HttpPost("supplier/{supplierId:int}/orders/{orderId:int}/reject")]
    [Authorize(Policy = "RequireSupplier")]
    public async Task<IActionResult> RejectOrder(int supplierId, int orderId, [FromBody] RejectOrderRequestDTO req)
    {
        var success = await _service.RejectOrderBySupplierAsync(orderId, supplierId, req.Reason);
        if (!success) return BadRequest(new { message = "Failed to reject order" });
        return Ok(new { message = "Order rejected" });
    }
}