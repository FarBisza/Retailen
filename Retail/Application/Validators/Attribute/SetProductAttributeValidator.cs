using FluentValidation;
using Retailen.Application.DTO.Attribute;

namespace Retailen.Application.Validators.Attribute
{
    public class SetProductAttributeValidator : AbstractValidator<SetProductAttributeDTO>
    {
        public SetProductAttributeValidator()
        {
            RuleFor(x => x.AttributeId)
                .GreaterThan(0).WithMessage("Attribute ID must be a positive number");
        }
    }
}
