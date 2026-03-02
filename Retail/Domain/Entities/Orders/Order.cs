namespace Retailen.Domain.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }               
        public DateTime OrderDate { get; set; } = DateTime.UtcNow; 
        public int OrderStatusId { get; set; }            
        public decimal Total { get; set; }                

        // Navigation properties
        public OrderStatusEntity OrderStatusEntity { get; set; } = null!; 
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();     
        public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();       
        public ICollection<Shipment> Shipments { get; set; } = new List<Shipment>();    
        public OrderShippingAddress ShippingAddress { get; set; } = null!;              
        public Customer Customer { get; set; } = null!;
    }
}
