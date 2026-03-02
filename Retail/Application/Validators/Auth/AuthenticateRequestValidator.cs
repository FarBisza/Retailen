using FluentValidation;
using Retailen.Application.DTO.Auth;

namespace Retailen.Application.Validators.Auth
{
    public class AuthenticateRequestValidator : AbstractValidator<AuthenticateRequestDTO>
    {
        public AuthenticateRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required");
        }
    }
}