namespace Retailen.Application.DTO.Product
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}