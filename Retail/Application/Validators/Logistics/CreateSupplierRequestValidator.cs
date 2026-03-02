using FluentValidation;
using Retailen.Application.DTO.Logistics;

namespace Retailen.Application.Validators.Logistics
{
    public class CreateSupplierRequestValidator : AbstractValidator<CreateSupplierRequestDTO>
    {
        public CreateSupplierRequestValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Supplier name is required")
                .MaximumLength(200).WithMessage("Supplier name must not exceed 200 characters");

            RuleFor(x => x.Email)
                .EmailAddress().WithMessage("Invalid email format")
                .When(x => !string.IsNullOrEmpty(x.Email));

            RuleFor(x => x.Phone)
                .Matches(@"^\+?[0-9\s-]{7,15}$").WithMessage("Invalid phone number format")
                .When(x => !string.IsNullOrEmpty(x.Phone));
        }
    }
}
