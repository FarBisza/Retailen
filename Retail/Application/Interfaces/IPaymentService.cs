using Retailen.Application.DTO;
using Retailen.Domain.Entities;

namespace Retailen.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<Invoice> GenerateInvoiceAsync(int orderId);
        Task<Payment> RegisterPaymentAsync(int invoiceId, decimal amount, int paymentTypeId);
    }
}