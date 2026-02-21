namespace Retailen.Domain.Entities
{
    public class Invoice
    {
        public int Id { get; set; }                      
        public int OrderId { get; set; }                 
        public int? InvoiceStatusId { get; set; }         
        public DateTime? IssuedDate { get; set; }         
        public decimal? Amount { get; set; }        

        // Navigation properties
        public Order Order { get; set; } = null!;         
        public InvoiceStatus InvoiceStatus { get; set; } = null!; 
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
