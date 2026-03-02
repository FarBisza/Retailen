namespace Retailen.Application.DTO.Order
{
    public class PayRequestDTO
    {
        public int PaymentTypeId { get; set; }
        public decimal Amount { get; set; }
        public int? WarehouseId { get; set; }
    }
}
