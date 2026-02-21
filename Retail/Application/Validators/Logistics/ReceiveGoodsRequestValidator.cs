using FluentValidation;
using Retailen.Application.DTO.Logistics;

namespace Retailen.Application.Validators.Logistics
{
    public class ReceiveGoodsRequestValidator : AbstractValidator<ReceiveGoodsRequestDTO>
    {
        public ReceiveGoodsRequestValidator()
        {
            RuleFor(x => x.Items)
                .NotEmpty().WithMessage("At least one item is required");

            RuleForEach(x => x.Items).ChildRules(item =>
            {
                item.RuleFor(x => x.ProductId)
                    .GreaterThan(0).WithMessage("Product ID must be a positive number");

                item.RuleFor(x => x.QuantityReceived)
                    .GreaterThanOrEqualTo(0).WithMessage("Quantity received cannot be negative");

                item.RuleFor(x => x.QuantityDamaged)
                    .GreaterThanOrEqualTo(0).WithMessage("Quantity damaged cannot be negative");
            });
        }
    }
}
