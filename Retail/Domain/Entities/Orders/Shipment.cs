using Retailen.Domain.Entities.Logistics;
using Retailen.Domain.Entities.Logistics.Deliveries.DeliveryDictionary;

namespace Retailen.Domain.Entities
{
    public class Shipment
    {
        public int Id { get; set; }                       
        public int OrderId { get; set; }                  
        public int WarehouseId { get; set; }              
        public string? TrackingNumber { get; set; }       
        public DateTime? ShipDate { get; set; }           
        public DateTime? DeliveryDate { get; set; }       
        public string? Carrier { get; set; }
        public string? ServiceLevel { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? ShipmentStatusId { get; set; }        

        // Navigation properties
        public Order Order { get; set; } = null!;         
        public ShipmentStatus Status { get; set; } = null!;
        public Warehouse Warehouse { get; set; } = null!; 
        public ICollection<ShipmentItem> Items { get; set; } = new List<ShipmentItem>();
        public ICollection<ShipmentStatusHistory> StatusHistory { get; set; } = new List<ShipmentStatusHistory>();
    }
}