namespace Retailen.Application.DTO.Logistics
{
    public class PurchaseOrderItemDTO
    {
        public int PurchaseOrderItemId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int QuantityOrdered { get; set; }
        public decimal? PurchasePrice { get; set; }
    }
}
