namespace Retailen.Application.DTO.Logistics
{
    public class ReceiveGoodsLineDto
    {
        public int ProductId { get; set; }
        public int QuantityReceived { get; set; }
        public int QuantityDamaged { get; set; }
    }
}
