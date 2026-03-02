namespace Retailen.Domain.Entities
{
    public class ShipmentItem
    {
        public int ShipmentId { get; set; }               
        public int OrderItemId { get; set; }              
        public int Quantity { get; set; }                 

        // Navigation properties
        public Shipment Shipment { get; set; } = null!;   
        public OrderItem OrderItem { get; set; } = null!;  
    }
}
