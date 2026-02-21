namespace Retailen.Domain.Entities.Logistics.Deliveries.DeliveryDictionary
{
    public class ShipmentStatusHistory
    {
        public long Id { get; set; }
        public int ShipmentId { get; set; }               
        public int ShipmentStatusId { get; set; }         
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
        public string? Comment { get; set; }

        // Navigation properties
        public ShipmentStatus Status { get; set; } = null!;
    }
}