namespace Retailen.Application.DTO.Logistics
{
    public class CreateSupplyOrderRequestDTO
    {
        public int SupplierId { get; set; }
        public int? WarehouseId { get; set; }
        public DateTime? ExpectedDate { get; set; }
        public string? Comment { get; set; }
        public List<SupplyOrderLineDTO> Items { get; set; } = new();
    }
}
