namespace Retailen.Application.DTO.Attribute
{
    public class AttributeDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string DataType { get; set; } = string.Empty;
        public string? Unit { get; set; }
    }
}