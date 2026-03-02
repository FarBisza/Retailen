using ProductEntity = Retailen.Domain.Entities.Product.Product;

namespace Retailen.Domain.Entities.Cart
{
    public class CartItem
    {
        public int Id { get; set; }                       
        public int CartId { get; set; }                   
        public int ProductId { get; private set; }        
        public int Quantity { get; private set; }         
        public DateTime? AddedAt { get; set; } = DateTime.UtcNow; 

        // Navigation properties
        public virtual ProductEntity Product { get; set; } = null!;

        public CartItem(int cartId, int productId, int quantity)
        {
            CartId = cartId;
            ProductId = productId;
            Quantity = quantity;
            AddedAt = DateTime.UtcNow;
        }

        protected CartItem() { } 

        public void IncreaseQuantity(int quantity)        
        {
            Quantity += quantity;
        }

        public void SetQuantity(int quantity)             
        {
            if (quantity <= 0)
                throw new ArgumentException("Quantity must be greater than zero.");
            Quantity = quantity;
        }
    }
}