namespace Retailen.Application.DTO.Cart
{
    public class AddToCartRequestDTO
    {
        public int? CustomerId { get; set; }
        public string SessionId { get; set; } = string.Empty;
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}