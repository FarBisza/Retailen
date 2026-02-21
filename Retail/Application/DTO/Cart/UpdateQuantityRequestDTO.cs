namespace Retailen.Application.DTO.Cart
{
    public class UpdateQuantityRequestDTO
    {
        public int CartId { get; set; }
        public int ItemId { get; set; }
        public int NewQuantity { get; set; }
    }
}