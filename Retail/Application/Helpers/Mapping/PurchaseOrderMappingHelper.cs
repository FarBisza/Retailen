using Retailen.Application.DTO.Logistics;
using Retailen.Domain.Entities.Logistics.Deliveries.Supplier;

namespace Retailen.Application.Helpers.Mapping
{
    public static class PurchaseOrderMappingHelper
    {
        public static PurchaseOrderDTO MapToPurchaseOrderDTO(PurchaseOrder po)
        {
            return new PurchaseOrderDTO
            {
                PurchaseOrderId = po.Id,
                SupplierId = po.SupplierId,
                SupplierName = po.Supplier?.Name ?? "",
                WarehouseId = po.WarehouseId,
                WarehouseName = po.Warehouse?.Name,
                StatusId = po.StatusId,
                StatusName = po.Status?.Name ?? "",
                CreatedAt = po.CreatedAt,
                ExpectedDate = po.ExpectedDate,
                Comment = po.Comment,
                Items = po.Items.Select(i => new PurchaseOrderItemDTO
                {
                    PurchaseOrderItemId = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.Product?.Name ?? $"Product #{i.ProductId}",
                    QuantityOrdered = i.QuantityOrdered,
                    PurchasePrice = i.PurchasePrice
                }).ToList()
            };
        }
    }
}
