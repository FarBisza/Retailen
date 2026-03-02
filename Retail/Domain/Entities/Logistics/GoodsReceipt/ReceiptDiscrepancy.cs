namespace Retailen.Domain.Entities.Logistics.GoodsReceipt
{
    public class GoodsReceiptDiscrepancy
    {
        public int Id { get; set; }                       
        public int GoodsReceiptId { get; set; }           
        public int ProductId { get; set; }                
        public string Type { get; set; } = default!;      
        public int Quantity { get; set; }                  
        public string? Description { get; set; }           
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public GoodsReceipt GoodsReceipt { get; set; } = null!;
    }
}