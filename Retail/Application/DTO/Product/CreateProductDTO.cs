using Retailen.Application.DTO.Attribute;

namespace Retailen.Application.DTO.Product
{
    public class CreateProductDTO
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public int? CategoryId { get; set; }
        public List<SetProductAttributeDTO>? Attributes { get; set; }
        public bool Active { get; set; } = true;
    }
}