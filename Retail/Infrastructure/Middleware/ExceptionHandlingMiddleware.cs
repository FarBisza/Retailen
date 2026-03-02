using System.Net;
using System.Text.Json;
using Retailen.Domain.Exceptions;

namespace Retailen.Infrastructure.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        private readonly IWebHostEnvironment _env;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger, IWebHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var (statusCode, message) = exception switch
            {
                EntityNotFoundException e   => ((int)HttpStatusCode.NotFound, e.Message),
                AccessDeniedException e     => ((int)HttpStatusCode.Forbidden, e.Message),
                BusinessRuleException e     => ((int)HttpStatusCode.BadRequest, e.Message),
                ArgumentException e         => ((int)HttpStatusCode.BadRequest, e.Message),
                UnauthorizedAccessException => ((int)HttpStatusCode.Forbidden, "Access denied"),
                InvalidOperationException e => ((int)HttpStatusCode.BadRequest, e.Message),
                _ => ((int)HttpStatusCode.InternalServerError, "Internal Server Error.")
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var response = new
            {
                StatusCode = statusCode,
                Message = message,
                Detailed = _env.IsDevelopment() && statusCode == 500 ? exception.Message : (string?)null
            };

            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
