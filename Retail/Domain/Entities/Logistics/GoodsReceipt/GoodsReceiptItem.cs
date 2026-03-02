using ProductEntity = Retailen.Domain.Entities.Product.Product;

namespace Retailen.Domain.Entities.Logistics.GoodsReceipt
{
    public class GoodsReceiptItem
    {
        public int Id { get; set; }                       
        public int GoodsReceiptId { get; set; }           
        public int ProductId { get; set; }                
        public int QuantityReceived { get; set; }         
        public int QuantityDamaged { get; set; }          

        // Navigation properties
        public GoodsReceipt GoodsReceipt { get; set; } = null!;
        public ProductEntity Product { get; set; } = null!;
    }
}
