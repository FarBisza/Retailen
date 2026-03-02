namespace Retailen.Application.DTO.Payment
{
    public class PayInvoiceRequestDTO
    {
        public int InvoiceId { get; set; }
        public decimal Amount { get; set; }
        public int PaymentTypeId { get; set; }
    }
}
