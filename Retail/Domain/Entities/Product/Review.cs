namespace Retailen.Domain.Entities.Product
{
    public class Review
    {
        public int Id { get; set; }                       
        public int ProductId { get; set; }                
        public int? CustomerId { get; set; }              
        public int? OrderItemId { get; set; }             
        public byte Rating { get; set; }                  
        public string? Title { get; set; }                
        public string? Content { get; set; }              
        public DateTime CreatedAt { get; set; }
        public string ModerationStatus { get; set; } = "approved"; 

        // Navigation properties
        public Product Product { get; set; } = null!;     
    }
}