namespace Retailen.Application.DTO.Logistics
{
    public class GoodsReceiptItemDTO
    {
        public int GoodsReceiptItemId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int QuantityReceived { get; set; }
        public int QuantityDamaged { get; set; }
    }
}
