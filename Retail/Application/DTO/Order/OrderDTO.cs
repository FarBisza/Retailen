namespace Retailen.Application.DTO.Order
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public int StatusId { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? OrderDate { get; set; }
        public decimal? Total { get; set; }
        // Navigation properties                     
        public List<OrderItemDTO> Items { get; set; } = new();
        public ShipmentInfoDTO Shipment { get; set; } = null!;
        public ShippingAddressDTO? ShippingAddress { get; set; }
        public bool HasInvoice { get; set; }
    }
}