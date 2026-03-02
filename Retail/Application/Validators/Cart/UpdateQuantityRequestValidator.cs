using FluentValidation;
using Retailen.Application.DTO.Cart;

namespace Retailen.Application.Validators.Cart
{
    public class UpdateQuantityRequestValidator : AbstractValidator<UpdateQuantityRequestDTO>
    {
        public UpdateQuantityRequestValidator()
        {
            RuleFor(x => x.CartId)
                .GreaterThan(0).WithMessage("Cart ID must be a positive number");

            RuleFor(x => x.ItemId)
                .GreaterThan(0).WithMessage("Item ID must be a positive number");

            RuleFor(x => x.NewQuantity)
                .GreaterThan(0).WithMessage("Quantity must be at least 1")
                .LessThanOrEqualTo(999).WithMessage("Quantity must not exceed 999");
        }
    }
}
