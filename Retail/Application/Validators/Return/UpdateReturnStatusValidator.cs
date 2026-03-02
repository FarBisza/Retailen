using FluentValidation;
using Retailen.Application.DTO.Return;

namespace Retailen.Application.Validators.Return
{
    public class UpdateReturnStatusValidator : AbstractValidator<UpdateReturnStatusDTO>
    {
        public UpdateReturnStatusValidator()
        {
            RuleFor(x => x.ReturnStatusId)
                .GreaterThan(0).WithMessage("Return Status ID must be a positive number");

            RuleFor(x => x.RefundAmount)
                .GreaterThanOrEqualTo(0).WithMessage("Refund amount cannot be negative")
                .When(x => x.RefundAmount.HasValue);

            RuleFor(x => x.AdminNote)
                .MaximumLength(1000).WithMessage("Admin note must not exceed 1000 characters")
                .When(x => x.AdminNote != null);
        }
    }
}
