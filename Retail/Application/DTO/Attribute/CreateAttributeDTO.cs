namespace Retailen.Application.DTO.Attribute
{
    public class CreateAttributeDTO
    {
        public string Name { get; set; } = string.Empty;
        public string DataType { get; set; } = "string";
        public string? Unit { get; set; }
    }
}
