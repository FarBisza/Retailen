namespace Retailen.Domain.Entities.Logistics.Deliveries.Supplier
{
    public class Supplier
    {
        public int Id { get; set; }                       
        public string Name { get; set; } = default!;      
        public string? Email { get; set; }
        public string? Phone { get; set; }                
        public bool Active { get; set; } = true;          

        // Navigation properties
        public ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new List<PurchaseOrder>();
    }
}