using FluentValidation;
using Retailen.Application.DTO.Order;

namespace Retailen.Application.Validators.Order
{
    public class CreateOrderValidator : AbstractValidator<CreateOrderRequestDTO>
    {
        public CreateOrderValidator()
        {
            RuleFor(x => x.CartId)
                .GreaterThan(0).WithMessage("Cart ID is required");

            RuleFor(x => x.ShippingAddress)
                .SetValidator(new ShippingAddressValidator()!)
                .When(x => x.ShippingAddress != null);
        }
    }
}
