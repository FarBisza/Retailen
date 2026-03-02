namespace Retailen.Domain.Entities.History
{
    public class OrderStatusHistory
    {
        public long Id { get; set; }
        public int OrderId { get; set; }                  
        public int OrderStatusId { get; set; }            
        public DateTime ChangedAt { get; set; }
        public string? Comment { get; set; }
    }
}