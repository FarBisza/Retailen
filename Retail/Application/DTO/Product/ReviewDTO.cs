namespace Retailen.Application.DTO.Product
{
    public class ReviewDTO
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
    }
}