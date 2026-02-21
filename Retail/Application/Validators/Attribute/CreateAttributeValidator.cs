using FluentValidation;
using Retailen.Application.DTO.Attribute;

namespace Retailen.Application.Validators.Attribute
{
    public class CreateAttributeValidator : AbstractValidator<CreateAttributeDTO>
    {
        private static readonly string[] AllowedDataTypes = { "string", "int", "decimal", "bool" };

        public CreateAttributeValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Attribute name is required")
                .MaximumLength(100).WithMessage("Attribute name must not exceed 100 characters");

            RuleFor(x => x.DataType)
                .NotEmpty().WithMessage("Data type is required")
                .Must(dt => AllowedDataTypes.Contains(dt.ToLower()))
                .WithMessage("Data type must be one of: string, int, decimal, bool");

            RuleFor(x => x.Unit)
                .MaximumLength(50).WithMessage("Unit must not exceed 50 characters")
                .When(x => x.Unit != null);
        }
    }
}
