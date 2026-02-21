using FluentValidation;
using Retailen.Application.DTO.Order;

namespace Retailen.Application.Validators.Order
{
    public class BillingInfoRequestValidator : AbstractValidator<BillingInfoRequestDTO>
    {
        public BillingInfoRequestValidator()
        {
            RuleFor(x => x.BuyerName)
                .NotEmpty().WithMessage("Buyer name is required")
                .MaximumLength(200).WithMessage("Buyer name must not exceed 200 characters");

            RuleFor(x => x.TaxId)
                .NotEmpty().WithMessage("Tax ID (NIP) is required")
                .MaximumLength(20).WithMessage("Tax ID must not exceed 20 characters");

            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("Address is required")
                .MaximumLength(200).WithMessage("Address must not exceed 200 characters");

            RuleFor(x => x.City)
                .NotEmpty().WithMessage("City is required")
                .MaximumLength(100).WithMessage("City must not exceed 100 characters");

            RuleFor(x => x.ZipCode)
                .NotEmpty().WithMessage("Zip Code is required")
                .Matches(@"^\d{2}-\d{3}$|^\d{5}$").WithMessage("Invalid Zip Code format (e.g., 00-000 or 00000)");

            RuleFor(x => x.Country)
                .NotEmpty().WithMessage("Country is required")
                .MaximumLength(100).WithMessage("Country must not exceed 100 characters");

            RuleFor(x => x.Email)
                .EmailAddress().WithMessage("Invalid email format")
                .When(x => !string.IsNullOrEmpty(x.Email));
        }
    }
}
