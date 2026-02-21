namespace Retailen.Application.DTO.Order
{
    public class CreateOrderRequestDTO
    {
        public int UserId { get; set; }
        public int CartId { get; set; }
        public ShippingAddressDTO? ShippingAddress { get; set; }
    }
}