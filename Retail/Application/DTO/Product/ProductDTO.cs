using Retailen.Application.DTO.Attribute;

namespace Retailen.Application.DTO.Product
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? Category { get; set; }
        public string? Style { get; set; }
        public List<string>? Colors { get; set; }
        public bool InStock { get; set; }
        public int StockLevel { get; set; }
        public int StockThreshold { get; set; } = 10;
        public List<string> Categories { get; set; } = new();

        // Navigation properties
        public List<ReviewDTO> Reviews { get; set; } = new();
        public List<ProductAttributeDTO> Attributes { get; set; } = new();
    }
}