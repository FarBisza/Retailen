using System.Net;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using Retailen.Application.DTO.Auth;
using Retailen.Infrastructure.Persistence;
using Xunit;

namespace Retailen.Tests.Integration
{
    public class AuthEndpointTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly CustomWebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public AuthEndpointTests(CustomWebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Register_ValidData_ReturnsOk()
        {
            var registerDto = new RegisterRequestDTO
            {
                Email = $"testuser_{Guid.NewGuid()}@example.com",
                Password = "Password123!",
                FirstName = "Test",
                LastName = "User",
                Phone = "123456789"
            };

            var response = await _client.PostAsJsonAsync("/api/auth/register", registerDto);

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsToken()
        {
            // 1. Register first
            var email = $"loginuser_{Guid.NewGuid()}@example.com";
            var password = "Password123!";
            var registerDto = new RegisterRequestDTO
            {
                Email = email,
                Password = password,
                FirstName = "Login",
                LastName = "User"
            };
            var registerResponse = await _client.PostAsJsonAsync("/api/auth/register", registerDto);
            Assert.Equal(HttpStatusCode.Created, registerResponse.StatusCode);

            // 2. Confirm Email directly in DB
            using (var scope = _factory.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var user = db.Customers.SingleOrDefault(c => c.Email == email);
                if (user != null)
                {
                    user.EmailConfirmed = true;
                    db.SaveChanges();
                }
            }

            // 3. Login
            var loginDto = new AuthenticateRequestDTO { Email = email, Password = password };
            var response = await _client.PostAsJsonAsync("/api/auth/login", loginDto);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            
            var result = await response.Content.ReadFromJsonAsync<AuthenticateResponseDTO>();
            Assert.NotNull(result);
            Assert.False(string.IsNullOrEmpty(result.AccessToken));
        }
    }
}
