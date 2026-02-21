namespace Retailen.Domain.Entities
{
    public class Payment
    {
        public int Id { get; set; }                       
        public int? OrderId { get; set; }                 
        public int? InvoiceId { get; set; }               
        public int PaymentTypeId { get; set; }            
        public decimal Amount { get; set; }               
        public DateTime? PaymentDate { get; set; }        

        // Navigation properties
        public Order Order { get; set; } = null!;         
        public Invoice Invoice { get; set; } = null!;     
        public PaymentType PaymentType { get; set; } = null!; 
    }
}
