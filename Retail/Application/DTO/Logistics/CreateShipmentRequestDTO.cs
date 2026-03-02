namespace Retailen.Application.DTO.Logistics
{
    public class CreateShipmentRequestDTO
    {
        public string? Carrier { get; set; }
        public string? ServiceLevel { get; set; }
        public string? TrackingNumber { get; set; }
        public List<ShipmentLineDTO> Items { get; set; } = new();
    }
}