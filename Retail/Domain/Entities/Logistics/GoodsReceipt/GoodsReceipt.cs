using Retailen.Domain.Entities.Logistics.Deliveries.Supplier;

namespace Retailen.Domain.Entities.Logistics.GoodsReceipt
{
    public class GoodsReceipt
    {
        public int Id { get; set; }                       
        public int PurchaseOrderId { get; set; }          
        public int? WarehouseId { get; set; }             
        public string? DocumentNumber { get; set; }       
        public DateTime ReceiptDate { get; set; } = DateTime.UtcNow; 
        public decimal? ShippingCost { get; set; }        
        public string? Comment { get; set; }

        // Navigation properties
        public PurchaseOrder PurchaseOrder { get; set; } = null!;
        public Warehouse Warehouse { get; set; } = null!;
        public ICollection<GoodsReceiptItem> Items { get; set; } = new List<GoodsReceiptItem>();
        public ICollection<GoodsReceiptDiscrepancy> Discrepancies { get; set; } = new List<GoodsReceiptDiscrepancy>();
    }
}