namespace Retailen.Domain.Entities
{
    public class OrderShippingAddress
    {
        public int OrderId { get; set; }                  
        public string Email { get; set; } = default!;
        public string FullName { get; set; } = default!;
        public string? PhoneNumber { get; set; }
        public string StreetAddress { get; set; } = default!;
        public string? Apartment { get; set; }
        public string City { get; set; } = default!;
        public string State { get; set; } = default!;
        public string ZipCode { get; set; } = default!;
        public string Country { get; set; } = default!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Order Order { get; set; } = null!;         
    }
}