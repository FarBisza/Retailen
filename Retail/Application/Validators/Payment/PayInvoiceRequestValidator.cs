using FluentValidation;
using Retailen.Application.DTO.Payment;

namespace Retailen.Application.Validators.Payment
{
    public class PayInvoiceRequestValidator : AbstractValidator<PayInvoiceRequestDTO>
    {
        public PayInvoiceRequestValidator()
        {
            RuleFor(x => x.InvoiceId)
                .GreaterThan(0).WithMessage("Invoice ID must be a positive number");

            RuleFor(x => x.Amount)
                .GreaterThan(0).WithMessage("Amount must be greater than 0");

            RuleFor(x => x.PaymentTypeId)
                .GreaterThan(0).WithMessage("Payment Type ID must be a positive number");
        }
    }
}
