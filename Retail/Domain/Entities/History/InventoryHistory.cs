namespace Retailen.Domain.Entities.History
{
    public class InventoryHistory
    {
        public long Id { get; set; }                      
        public int ProductId { get; set; }                
        public int? WarehouseId { get; set; }             
        public int? OrderId { get; set; }                 
        public string EventType { get; set; } = default!; 
        public int QuantityChange { get; set; }           
        public int? QuantityBefore { get; set; }          
        public int? QuantityAfter { get; set; }           
        public DateTime CreatedAt { get; set; }
    }
}