namespace Retailen.Application.DTO.Cart
{
    public class CartDTO
    {
        public int Id { get; set; }
        public int? CustomerId { get; set; }
        public List<CartItemDTO> Items { get; set; } = new();
        public decimal TotalAmount => Items.Sum(x => x.LineTotal);
    }
}