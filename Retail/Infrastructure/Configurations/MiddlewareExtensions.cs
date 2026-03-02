using Microsoft.AspNetCore.Builder;
using Retailen.Infrastructure.Middleware;

namespace Retailen.Infrastructure.Configurations
{
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder UseInfrastructureMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<ExceptionHandlingMiddleware>();
            app.UseMiddleware<RequestLoggingMiddleware>();
            return app;
        }
    }
}
