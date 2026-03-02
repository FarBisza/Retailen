namespace Retailen.Domain.Entities
{
    public class OrderBillingInfo
    {
        public int OrderId { get; set; }                  
        public string BuyerName { get; set; } = default!; 
        public string TaxId { get; set; } = default!;     
        public string Address { get; set; } = default!;   
        public string City { get; set; } = default!;      
        public string ZipCode { get; set; } = default!;   
        public string Country { get; set; } = default!;   
        public string? Email { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
