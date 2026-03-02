using FluentValidation;
using Retailen.Application.DTO.Order;

namespace Retailen.Application.Validators.Order
{
    public class PayRequestValidator : AbstractValidator<PayRequestDTO>
    {
        public PayRequestValidator()
        {
            // OrderId is typically in the URL, so we don't validate it here unless it's in the DTO.
            // RuleFor(x => x.OrderId).GreaterThan(0); 

            RuleFor(x => x.PaymentTypeId)
                .GreaterThan(0).WithMessage("Invalid Payment Type ID");

            RuleFor(x => x.Amount)
                .GreaterThan(0).WithMessage("Payment amount must be greater than zero");
        }
    }
}
