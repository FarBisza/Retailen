namespace Retailen.Domain.Entities.Product
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; private set; }          
        public string? Description { get; private set; }  
        public decimal Price { get; private set; }        
        public string? ImageUrl { get; private set; }     
        public bool? Active { get; private set; }         
        public DateTime? CreatedAt { get; private set; }  

        // Navigation properties
        public ICollection<Review> Reviews { get; set; } = new List<Review>();                 
        public ICollection<ProductCategory> ProductCategories { get; set; } = new List<ProductCategory>(); // was: ProduktKategorie
        public virtual ICollection<ProductAttribute> ProductAttributes { get; set; } = new List<ProductAttribute>(); // was: ProduktAtrybuty

        public Product(string name, decimal price)
        {
            Name = name;
            Price = price;
            CreatedAt = DateTime.UtcNow;
            Active = true;
        }

        protected Product() 
        {
            Name = null!;
            Description = null;
            ImageUrl = null;
        }

        public void UpdateDetails(string name, string? description, decimal price, string? imageUrl)
        {
            Name = name;
            Description = description;
            Price = price;
            ImageUrl = imageUrl;
        }

        public void SetActive(bool active)
        {
            Active = active;
        }
    }
}