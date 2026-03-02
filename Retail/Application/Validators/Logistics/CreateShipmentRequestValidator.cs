using FluentValidation;
using Retailen.Application.DTO.Logistics;

namespace Retailen.Application.Validators.Logistics
{
    public class CreateShipmentRequestValidator : AbstractValidator<CreateShipmentRequestDTO>
    {
        public CreateShipmentRequestValidator()
        {
            RuleFor(x => x.Items)
                .NotEmpty().WithMessage("At least one shipment item is required");

            RuleForEach(x => x.Items).ChildRules(item =>
            {
                item.RuleFor(x => x.OrderItemId)
                    .GreaterThan(0).WithMessage("Order Item ID must be a positive number");

                item.RuleFor(x => x.Quantity)
                    .GreaterThan(0).WithMessage("Quantity must be at least 1");
            });
        }
    }
}
