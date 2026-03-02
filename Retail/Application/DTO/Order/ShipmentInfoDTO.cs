namespace Retailen.Application.DTO.Order
{
    public class ShipmentInfoDTO
    {
        public string? TrackingNumber { get; set; }
        public string? Carrier { get; set; }
        public DateTime? ShippedDate { get; set; }
        public DateTime? DeliveredDate { get; set; }
        public int ShipmentStatusId { get; set; }
    }
}