using FluentValidation;
using Retailen.Application.DTO.Product;

namespace Retailen.Application.Validators.Product
{
    public class UpdateProductValidator : AbstractValidator<UpdateProductDTO>
    {
        public UpdateProductValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Product name is required")
                .MaximumLength(200).WithMessage("Product name must not exceed 200 characters");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0")
                .LessThanOrEqualTo(999999.99m).WithMessage("Price must not exceed 999,999.99");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters")
                .When(x => x.Description != null);

            RuleFor(x => x.ImageUrl)
                .MaximumLength(500).WithMessage("Image URL must not exceed 500 characters")
                .When(x => x.ImageUrl != null);

            RuleFor(x => x.CategoryId)
                .GreaterThan(0).WithMessage("Category ID must be a positive number")
                .When(x => x.CategoryId.HasValue);

            RuleForEach(x => x.Attributes).ChildRules(attributes =>
            {
                attributes.RuleFor(a => a.Value)
                    .NotEmpty().WithMessage("Attribute value cannot be empty.");
                attributes.RuleFor(a => a.AttributeId)
                    .GreaterThan(0).WithMessage("Attribute ID must be valid.");
            }).When(x => x.Attributes != null);
        }
    }
}
