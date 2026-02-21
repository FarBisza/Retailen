using Retailen.Application.DTO.Logistics;
using Retailen.Domain.Entities.Logistics.GoodsReceipt;

namespace Retailen.Application.Helpers.Mapping
{
    public static class GoodsReceiptMappingHelper
    {
        public static GoodsReceiptDTO MapToGoodsReceiptDTO(GoodsReceipt gr)
        {
            return new GoodsReceiptDTO
            {
                GoodsReceiptId = gr.Id,
                PurchaseOrderId = gr.PurchaseOrderId,
                WarehouseId = gr.WarehouseId,
                WarehouseName = gr.Warehouse?.Name,
                DocumentNumber = gr.DocumentNumber,
                ReceiptDate = gr.ReceiptDate,
                ShippingCost = gr.ShippingCost,
                Comment = gr.Comment,
                Items = gr.Items.Select(x => new GoodsReceiptItemDTO
                {
                    GoodsReceiptItemId = x.Id,
                    ProductId = x.ProductId,
                    ProductName = x.Product?.Name ?? $"Product #{x.ProductId}",
                    QuantityReceived = x.QuantityReceived,
                    QuantityDamaged = x.QuantityDamaged
                }).ToList()
            };
        }
    }
}
