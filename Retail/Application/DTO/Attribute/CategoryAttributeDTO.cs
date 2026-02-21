namespace Retailen.Application.DTO.Attribute
{
    public class CategoryAttributeDTO : AttributeDTO
    {
        public bool IsRequired { get; set; }
        public int SortOrder { get; set; }
    }
}