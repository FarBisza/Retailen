namespace Retailen.Application.DTO.Return
{
    public class ReturnDTO
    {
        public int ReturnId { get; set; }
        public int OrderId { get; set; }
        public int CustomerId { get; set; }
        public string? CustomerEmail { get; set; }
        public string? CustomerName { get; set; }
        public int ReturnStatusId { get; set; }
        public string? StatusName { get; set; }
        public int? OrderItemId { get; set; }
        public string? ProductName { get; set; }
        public int Quantity { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal RefundAmount { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public DateTime? RefundDate { get; set; }
        public string? AdminNote { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}