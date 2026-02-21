namespace Retailen.Application.DTO.Logistics
{
    public class GoodsReceiptDTO
    {
        public int GoodsReceiptId { get; set; }
        public int PurchaseOrderId { get; set; }
        public int? WarehouseId { get; set; }
        public string? WarehouseName { get; set; }
        public string? DocumentNumber { get; set; }
        public DateTime ReceiptDate { get; set; }
        public decimal? ShippingCost { get; set; }
        public string? Comment { get; set; }
        public List<GoodsReceiptItemDTO> Items { get; set; } = new();
    }
}
