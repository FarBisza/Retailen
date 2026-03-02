using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Retailen.Infrastructure.Configurations
{
    public static class FluentValidationExtensions
    {
        public static IServiceCollection AddFluentValidators(
            this IServiceCollection services)
        {
            services.AddValidatorsFromAssembly(
                Assembly.Load("Retailen.Application"));

            return services;
        }
    }
}