namespace Retailen.Application.DTO.Order
{
    public class BillingInfoRequestDTO
    {
        public string BuyerName { get; set; } = default!;
        public string TaxId { get; set; } = default!;
        public string Address { get; set; } = default!;
        public string City { get; set; } = default!;
        public string ZipCode { get; set; } = default!;
        public string Country { get; set; } = default!;
        public string? Email { get; set; }
    }
}