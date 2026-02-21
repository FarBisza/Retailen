using FluentValidation;
using Retailen.Application.DTO.Cart;

namespace Retailen.Application.Validators.Cart
{
    public class AddToCartRequestValidator : AbstractValidator<AddToCartRequestDTO>
    {
        public AddToCartRequestValidator()
        {
            RuleFor(x => x.ProductId)
                .GreaterThan(0).WithMessage("Product ID must be a positive number");

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be at least 1")
                .LessThanOrEqualTo(999).WithMessage("Quantity must not exceed 999");
        }
    }
}
