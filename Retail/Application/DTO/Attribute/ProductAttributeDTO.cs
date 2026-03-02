namespace Retailen.Application.DTO.Attribute
{
    public class ProductAttributeDTO
    {
        public long Id { get; set; }
        public int ProductId { get; set; }
        public int AttributeId { get; set; }
        public string? AttributeName { get; set; }
        public string? Value { get; set; }
    }
}