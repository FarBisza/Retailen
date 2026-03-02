namespace Retailen.Domain.Entities.Product
{
    public class Category
    {
        public int Id { get; private set; }
        public int? ParentId { get; private set; }
        public string Name { get; private set; }          

        // Navigation properties
        public Category? Parent { get; private set; }
        public ICollection<Category> Children { get; private set; } = new List<Category>();
        public ICollection<ProductCategory> ProductCategories { get; private set; } = new List<ProductCategory>();
        public ICollection<CategoryAttribute> Attributes { get; private set; } = new List<CategoryAttribute>();

        public Category(string name, int? parentId = null)
        {
            Name = name;
            ParentId = parentId;
        }

        protected Category() 
        {
            Name = null!;
        }

        public void UpdateName(string name)               
        {
            Name = name;
        }
    }
}