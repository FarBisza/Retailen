namespace Retailen.Domain.Entities.Product
{
    public class CategoryAttribute
    {
        public int CategoryId { get; set; }               
        public int AttributeId { get; set; }              
        public bool IsRequired { get; set; }
        public int SortOrder { get; set; }

        // Navigation properties
        public Category Category { get; set; } = null!;   
        public Attribute Attribute { get; set; } = null!; 
    }
}
