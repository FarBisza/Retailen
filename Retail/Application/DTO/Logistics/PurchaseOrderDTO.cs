namespace Retailen.Application.DTO.Logistics
{
    public class PurchaseOrderDTO
    {
        public int PurchaseOrderId { get; set; }
        public int SupplierId { get; set; }
        public string SupplierName { get; set; } = string.Empty;
        public int? WarehouseId { get; set; }
        public string? WarehouseName { get; set; }
        public int StatusId { get; set; }
        public string StatusName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? ExpectedDate { get; set; }
        public string? Comment { get; set; }
        public List<PurchaseOrderItemDTO> Items { get; set; } = new();
    }
}
