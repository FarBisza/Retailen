using FluentValidation;
using Retailen.Application.DTO.Product;

namespace Retailen.Application.Validators.Product
{
    public class AddReviewValidator : AbstractValidator<AddReviewDTO>
    {
        public AddReviewValidator()
        {
            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5");

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Review content cannot be empty")
                .MinimumLength(10).WithMessage("Review must be at least 10 characters long")
                .MaximumLength(1000).WithMessage("Review must not exceed 1000 characters");
        }
    }
}
