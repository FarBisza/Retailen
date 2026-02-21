using FluentValidation;
using Retailen.Application.DTO.Logistics;

namespace Retailen.Application.Validators.Logistics
{
    public class CreateSupplyOrderRequestValidator : AbstractValidator<CreateSupplyOrderRequestDTO>
    {
        public CreateSupplyOrderRequestValidator()
        {
            RuleFor(x => x.SupplierId)
                .GreaterThan(0).WithMessage("Supplier ID must be a positive number");

            RuleFor(x => x.Items)
                .NotEmpty().WithMessage("At least one item is required");

            RuleForEach(x => x.Items).ChildRules(item =>
            {
                item.RuleFor(x => x.ProductId)
                    .GreaterThan(0).WithMessage("Product ID must be a positive number");

                item.RuleFor(x => x.QuantityOrdered)
                    .GreaterThan(0).WithMessage("Quantity ordered must be at least 1");

                item.RuleFor(x => x.PurchasePrice)
                    .GreaterThan(0).WithMessage("Purchase price must be greater than 0")
                    .When(x => x.PurchasePrice.HasValue);
            });
        }
    }
}
