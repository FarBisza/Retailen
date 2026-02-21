using FluentValidation;
using Retailen.Application.DTO.Return;

namespace Retailen.Application.Validators.Return
{
    public class CreateReturnRequestValidator : AbstractValidator<CreateReturnRequestDTO>
    {
        public CreateReturnRequestValidator()
        {
            RuleFor(x => x.OrderItemId)
                .GreaterThan(0).WithMessage("Invalid Order Item ID");

            RuleFor(x => x.Reason)
                .NotEmpty().WithMessage("Return reason is required")
                .MaximumLength(500).WithMessage("Reason must not exceed 500 characters");

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be greater than zero");
        }
    }
}
