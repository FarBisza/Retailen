using ProductEntity = Retailen.Domain.Entities.Product.Product;

namespace Retailen.Domain.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }                       
        public int OrderId { get; set; }                  
        public int ProductId { get; set; }                
        public int Quantity { get; set; }                 
        public decimal UnitPrice { get; set; }            

        // Navigation properties
        public Order Order { get; set; } = null!;         
        public ProductEntity Product { get; set; } = null!; 
    }
}
