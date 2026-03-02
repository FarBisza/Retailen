using Retailen.Infrastructure.Configurations;
using Retailen.Infrastructure.Filters;
using Retailen.Infrastructure.Persistence.Seeders;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Add services to the container
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilter>();
})
    .AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

// 2. Add Infrastructure (DB, Services, Repositories, AutoMapper)
builder.Services.AddInfrastructure(builder.Configuration);

// 3. Add Authentication & Authorization
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddAuthorizationPolicies();

// 4. CORS — origins from configuration
var corsOrigins = builder.Configuration.GetSection("CorsOrigins").Get<string[]>()
    ?? new[] { "https://retailen.onrender.com", "https://retailen-frontend.onrender.com", "http://localhost:3000", "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod() // .AllowAnyHeader() .AllowCredentials()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// 5. Seeding
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<Retailen.Infrastructure.Persistence.AppDbContext>();
    // Apply any pending migrations automatically on startup
    await context.Database.MigrateAsync();
    
    try 
    {
        await ColorSeeder.SeedColorsAsync(context);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Seeding failed: {ex.Message}");
    }
}

// 6. Configure Middleware Pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseInfrastructureMiddleware(); // Custom Global Exception Handling & Logging

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }
