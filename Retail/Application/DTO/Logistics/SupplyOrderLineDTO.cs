namespace Retailen.Application.DTO.Logistics
{
    public class SupplyOrderLineDTO
    {
        public int ProductId { get; set; }
        public int QuantityOrdered { get; set; }
        public decimal? PurchasePrice { get; set; }
    }
}
