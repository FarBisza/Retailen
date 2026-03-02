using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Retailen.Infrastructure.Filters
{
    public class ValidationFilter : IAsyncActionFilter
    {
        private readonly IServiceProvider _serviceProvider;

        public ValidationFilter(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            foreach (var argument in context.ActionArguments)
            {
                if (argument.Value == null) continue;

                var argumentType = argument.Value.GetType();
                var validatorType = typeof(IValidator<>).MakeGenericType(argumentType);
                var validator = _serviceProvider.GetService(validatorType);

                if (validator == null) continue;

                var validateMethod = validatorType.GetMethod("ValidateAsync",
                    new[] { argumentType, typeof(CancellationToken) });

                if (validateMethod == null) continue;

                var result = await (Task<FluentValidation.Results.ValidationResult>)
                    validateMethod.Invoke(validator, new[] { argument.Value, CancellationToken.None })!;

                if (!result.IsValid)
                {
                    var errors = result.Errors
                        .GroupBy(e => e.PropertyName)
                        .ToDictionary(
                            g => g.Key,
                            g => g.Select(e => e.ErrorMessage).ToArray()
                        );

                    context.Result = new BadRequestObjectResult(new
                    {
                        type = "ValidationError",
                        title = "One or more validation errors occurred.",
                        status = 400,
                        errors
                    });
                    return;
                }
            }

            await next();
        }
    }
}
