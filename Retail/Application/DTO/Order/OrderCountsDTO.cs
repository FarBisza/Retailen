namespace Retailen.Application.DTO.Order
{
    public class OrderCountsDTO
    {
        public int ToPay { get; set; }
        public int ToShip { get; set; }
        public int Shipped { get; set; }
        public int ToReview { get; set; }
        public int Returns { get; set; }
    }
}
