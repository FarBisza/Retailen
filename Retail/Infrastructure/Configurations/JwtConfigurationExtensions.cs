using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Retailen.Infrastructure.Configurations
{
    public static class JwtConfigurationExtensions
    {
        public static IServiceCollection AddJwtAuthentication(
            this IServiceCollection services, IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];

            if (string.IsNullOrEmpty(secretKey))
                throw new InvalidOperationException(
                    "JWT SecretKey is not configured in appsettings.json");

            var key = Encoding.UTF8.GetBytes(secretKey);

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = issuer,
                        ValidateAudience = true,
                        ValidAudience = audience,
                        ValidateLifetime = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuerSigningKey = true,
                        ClockSkew = TimeSpan.Zero,
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            if (context.Exception is SecurityTokenExpiredException)
                            {
                                context.Response.Headers
                                    .Append("Token-Expired", "true");
                            }
                            return Task.CompletedTask;
                        },
                        OnTokenValidated = context => Task.CompletedTask
                    };
                });

            return services;
        }

        public static IServiceCollection AddAuthorizationPolicies(
            this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                // Admin (RoleID=1)
                options.AddPolicy("RequireAdmin", policy =>
                    policy.RequireRole("Admin"));

                // Customer (RoleID=2)
                options.AddPolicy("RequireCustomer", policy =>
                    policy.RequireRole("Customer"));

                // Staff / Employee (RoleID=3)
                options.AddPolicy("RequireStaff", policy =>
                    policy.RequireRole("Employee"));

                // Supplier (RoleID=4)
                options.AddPolicy("RequireSupplier", policy =>
                    policy.RequireRole("Supplier"));
            });

            return services;
        }
    }
}