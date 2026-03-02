using FluentValidation;
using Retailen.Application.DTO.Order;

namespace Retailen.Application.Validators.Order
{
    public class ShippingAddressValidator : AbstractValidator<ShippingAddressDTO>
    {
        public ShippingAddressValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full Name is required")
                .MaximumLength(100).WithMessage("Full Name must not exceed 100 characters");

            RuleFor(x => x.StreetAddress)
                .NotEmpty().WithMessage("Street Address is required")
                .MaximumLength(200).WithMessage("Street Address must not exceed 200 characters");

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

            RuleFor(x => x.PhoneNumber)
                .Matches(@"^\+?[0-9\s-]{7,15}$").WithMessage("Invalid phone number format")
                .When(x => !string.IsNullOrEmpty(x.PhoneNumber));
        }
    }
}
