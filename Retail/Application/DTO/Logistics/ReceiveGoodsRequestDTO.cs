namespace Retailen.Application.DTO.Logistics
{
    public class ReceiveGoodsRequestDTO
    {
        public int? WarehouseId { get; set; }
        public string? DocumentNumber { get; set; }
        public decimal? ShippingCost { get; set; }
        public string? Comment { get; set; }
        public List<ReceiveGoodsLineDto> Items { get; set; } = new();
    }
}