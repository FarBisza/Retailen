namespace Retailen.Application.DTO.Logistics
{
    public class SupplierDTO
    {
        public int SupplierId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public bool Active { get; set; }
    }
}
