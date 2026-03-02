using FluentValidation;
using Retailen.Presentation.Controllers;

namespace Retailen.Application.Validators.Category
{
    public class CreateCategoryRequestValidator : AbstractValidator<CreateCategoryRequest>
    {
        public CreateCategoryRequestValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Category name is required")
                .MaximumLength(100).WithMessage("Category name must not exceed 100 characters");

            RuleFor(x => x.ParentId)
                .GreaterThan(0).WithMessage("Parent ID must be a positive number")
                .When(x => x.ParentId.HasValue);
        }
    }
}
