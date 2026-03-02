using Retailen.Domain.Entities.Logistics.Deliveries.DeliveryDictionary;
using Retailen.Domain.Entities.Logistics.GoodsReceipt;

namespace Retailen.Domain.Entities.Logistics.Deliveries.Supplier
{
    public class PurchaseOrder
    {
        public int Id { get; set; }                       
        public int SupplierId { get; set; }               
        public int? WarehouseId { get; set; }             
        public int StatusId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
        public DateTime? ExpectedDate { get; set; }       
        public string? Comment { get; set; }

        // Navigation properties
        public Supplier Supplier { get; set; } = null!;
        public PurchaseOrderStatus Status { get; set; } = null!;
        public Logistics.Warehouse Warehouse { get; set; } = null!;
        public ICollection<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();
        public ICollection<GoodsReceipt.GoodsReceipt> GoodsReceipts { get; set; } = new List<GoodsReceipt.GoodsReceipt>();
    }
}
