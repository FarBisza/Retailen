namespace Retailen.Application.DTO.Return
{
    public class CreateReturnRequestDTO
    {
        public int OrderId { get; set; }
        public int? OrderItemId { get; set; }
        public int Quantity { get; set; } = 1;
        public string Reason { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}