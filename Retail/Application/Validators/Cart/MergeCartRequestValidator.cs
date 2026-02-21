using FluentValidation;
using Retailen.Application.DTO.Cart;

namespace Retailen.Application.Validators.Cart
{
    public class MergeCartRequestValidator : AbstractValidator<MergeCartRequestDTO>
    {
        public MergeCartRequestValidator()
        {
            RuleFor(x => x.SessionId)
                .NotEmpty().WithMessage("Session ID is required");
        }
    }
}
