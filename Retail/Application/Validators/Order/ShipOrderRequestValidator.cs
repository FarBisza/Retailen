using FluentValidation;
using Retailen.Application.DTO.Order;

namespace Retailen.Application.Validators.Order
{
    public class ShipOrderRequestValidator : AbstractValidator<ShipOrderRequestDTO>
    {
        public ShipOrderRequestValidator()
        {
            RuleFor(x => x.Carrier)
                .NotEmpty().WithMessage("Carrier is required")
                .MaximumLength(100).WithMessage("Carrier must not exceed 100 characters");

            RuleFor(x => x.TrackingNumber)
                .NotEmpty().WithMessage("Tracking number is required")
                .MaximumLength(100).WithMessage("Tracking number must not exceed 100 characters");
        }
    }
}
