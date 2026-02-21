namespace Retailen.Application.DTO.Logistics
{
    public class MarkShippedRequestDTO
    {
        public string? TrackingNumber { get; set; }
        public DateTime? ShippedDate { get; set; }
    }
}
