namespace Retailen.Application.DTO.Return
{
    public class UpdateReturnStatusDTO
    {
        public int ReturnStatusId { get; set; }
        public decimal? RefundAmount { get; set; }
        public string? AdminNote { get; set; }
    }
}