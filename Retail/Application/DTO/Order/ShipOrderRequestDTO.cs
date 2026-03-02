namespace Retailen.Application.DTO.Order
{
    public class ShipOrderRequestDTO
    {
        public string Carrier { get; set; } = string.Empty;
        public string TrackingNumber { get; set; } = string.Empty;
    }
}