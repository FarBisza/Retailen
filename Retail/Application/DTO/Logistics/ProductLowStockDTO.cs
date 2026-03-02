namespace Retailen.Application.DTO.Logistics
{
    public class ProductLowStockDTO
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int WarehouseId { get; set; }
        public string WarehouseName { get; set; } = string.Empty;
        public int CurrentStock { get; set; }
        public int Threshold { get; set; }
        public int SuggestedOrderQuantity { get; set; }
    }
}
