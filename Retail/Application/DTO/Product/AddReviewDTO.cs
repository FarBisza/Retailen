namespace Retailen.Application.DTO.Product
{
    public class AddReviewDTO
    {
        public int Rating { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}