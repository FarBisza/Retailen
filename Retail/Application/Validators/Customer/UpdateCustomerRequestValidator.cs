using FluentValidation;
using Retailen.Application.DTO.Customer;

namespace Retailen.Application.Validators.Customer
{
    public class UpdateCustomerRequestValidator : AbstractValidator<UpdateCustomerRequestDTO>
    {
        public UpdateCustomerRequestValidator()
        {
            RuleFor(x => x.FirstName)
                .MaximumLength(50).WithMessage("First name must not exceed 50 characters")
                .When(x => x.FirstName != null);

            RuleFor(x => x.LastName)
                .MaximumLength(50).WithMessage("Last name must not exceed 50 characters")
                .When(x => x.LastName != null);

            RuleFor(x => x.Phone)
                .Matches(@"^\+?[0-9\s-]{7,15}$").WithMessage("Invalid phone number format")
                .When(x => !string.IsNullOrEmpty(x.Phone));

            RuleFor(x => x.City)
                .MaximumLength(100).WithMessage("City must not exceed 100 characters")
                .When(x => x.City != null);

            RuleFor(x => x.ZipCode)
                .Matches(@"^\d{2}-\d{3}$|^\d{5}$").WithMessage("Invalid Zip Code format (e.g., 00-000 or 00000)")
                .When(x => !string.IsNullOrEmpty(x.ZipCode));

            RuleFor(x => x.Country)
                .MaximumLength(100).WithMessage("Country must not exceed 100 characters")
                .When(x => x.Country != null);
        }
    }
}
