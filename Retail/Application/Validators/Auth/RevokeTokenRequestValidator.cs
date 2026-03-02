using FluentValidation;
using Retailen.Application.DTO.Auth;

namespace Retailen.Application.Validators.Auth
{
    public class RevokeTokenRequestValidator : AbstractValidator<RevokeTokenRequestDTO>
    {
        public RevokeTokenRequestValidator()
        {
            RuleFor(x => x.RefreshToken)
                .NotEmpty().WithMessage("Refresh token is required");
        }
    }
}
