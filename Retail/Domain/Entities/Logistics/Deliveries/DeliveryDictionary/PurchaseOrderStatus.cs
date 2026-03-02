namespace Retailen.Domain.Entities.Logistics.Deliveries.DeliveryDictionary
{
    public class PurchaseOrderStatus
    {
        public int Id { get; set; }                       
        public string Name { get; set; } = default!;      
        public string? Description { get; set; }           
    }
}