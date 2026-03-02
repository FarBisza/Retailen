namespace Retailen.Domain.Entities
{
    public class Return : BaseEntity
    {
        public int ReturnId { get; set; }                 
        public int OrderId { get; set; }                  
        public int CustomerId { get; set; }               
        public int ReturnStatusId { get; set; } = 1;      

        public int? OrderItemId { get; set; }             
        public int Quantity { get; set; } = 1;            

        public string Reason { get; set; } = string.Empty; 
        public string? Description { get; set; }           

        public decimal RefundAmount { get; set; }         
        public DateTime? ApprovalDate { get; set; }       
        public DateTime? RefundDate { get; set; }         

        public string? AdminNote { get; set; }            

        // Navigation properties
        public Order Order { get; set; } = null!;         
        public Customer Customer { get; set; } = null!;   
    }
}