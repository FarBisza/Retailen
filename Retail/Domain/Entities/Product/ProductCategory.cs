namespace Retailen.Domain.Entities.Product
{
    public class ProductCategory
    {
        public int ProductId { get; private set; }        
        public int CategoryId { get; private set; }       

        // Navigation properties
        public Product Product { get; private set; } = null!;   
        public Category Category { get; private set; } = null!; 

        public ProductCategory(int productId, int categoryId)
        {
            ProductId = productId;
            CategoryId = categoryId;
        }

        protected ProductCategory() { }
    }
}