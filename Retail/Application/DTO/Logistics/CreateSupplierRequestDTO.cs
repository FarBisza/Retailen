namespace Retailen.Application.DTO.Logistics
{
    public class CreateSupplierRequestDTO
    {
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }
}