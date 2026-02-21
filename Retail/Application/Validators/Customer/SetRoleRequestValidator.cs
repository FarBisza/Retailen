using FluentValidation;
using Retailen.Application.DTO.Customer;

namespace Retailen.Application.Validators.Customer
{
    public class SetRoleRequestValidator : AbstractValidator<SetRoleRequestDTO>
    {
        public SetRoleRequestValidator()
        {
            RuleFor(x => x.RoleId)
                .GreaterThan(0).WithMessage("Role ID must be a positive number");
        }
    }
}
