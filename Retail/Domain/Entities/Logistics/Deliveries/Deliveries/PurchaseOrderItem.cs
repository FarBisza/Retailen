using ProductEntity = Retailen.Domain.Entities.Product.Product;

namespace Retailen.Domain.Entities.Logistics.Deliveries.Supplier
{
    public class PurchaseOrderItem
    {
        public int Id { get; set; }                       
        public int PurchaseOrderId { get; set; }          
        public int ProductId { get; set; }                
        public int QuantityOrdered { get; set; }          
        public decimal? PurchasePrice { get; set; }       

        // Navigation properties
        public PurchaseOrder PurchaseOrder { get; set; } = null!;
        public ProductEntity Product { get; set; } = null!;
    }
}