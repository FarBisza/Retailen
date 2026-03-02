using FluentValidation;
using Retailen.Application.DTO.Product;

namespace Retailen.Application.Validators.Product
{
    public class CreateProductValidator : AbstractValidator<CreateProductDTO>
    {
        public CreateProductValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Product name is required")
                .MaximumLength(200).WithMessage("Product name must not exceed 200 characters");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than zero");

            RuleForEach(x => x.Attributes).ChildRules(attributes =>
            {
                attributes.RuleFor(a => a.Value)
                    .NotEmpty().WithMessage("Attribute value cannot be empty.");
                attributes.RuleFor(a => a.AttributeId)
                    .GreaterThan(0).WithMessage("Attribute ID must be valid.");
            });
        }
    }
}
