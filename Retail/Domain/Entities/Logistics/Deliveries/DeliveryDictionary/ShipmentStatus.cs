namespace Retailen.Domain.Entities.Logistics.Deliveries.DeliveryDictionary
{
    public class ShipmentStatus
    {
        public int Id { get; set; }                       
        public string Name { get; set; } = default!;      
        public string? Description { get; set; }           
    }
}
