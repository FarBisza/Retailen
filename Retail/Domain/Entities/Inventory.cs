using ProductEntity = Retailen.Domain.Entities.Product.Product;

namespace Retailen.Domain.Entities
{
    public class Inventory
    {
        public int ProductId { get; set; }                
        public int WarehouseId { get; set; }              
        public int Quantity { get; set; }                 
        public DateTime UpdatedAt { get; set; }

        // Navigation properties
        public virtual ProductEntity Product { get; set; } = null!;
    }
}