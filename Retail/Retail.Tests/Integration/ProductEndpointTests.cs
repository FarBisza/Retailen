using System.Net;
using System.Net.Http.Json;
using System.Net.Http.Headers;
using Retailen.Application.DTO.Auth;
using Retailen.Application.DTO.Product;
using Retailen.Domain.Entities.Product;
using Xunit;

namespace Retailen.Tests.Integration
{
    public class ProductEndpointTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory<Program> _factory;

        public ProductEndpointTests(CustomWebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        private async Task<string> AuthenticateAsync(string email, string password)
        {
             await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequestDTO 
             { 
                 Email = email, 
                 Password = password, 
                 FirstName = "Test", 
                 LastName = "User" 
             });

             var response = await _client.PostAsJsonAsync("/api/auth/login", new AuthenticateRequestDTO { Email = email, Password = password });
             var auth = await response.Content.ReadFromJsonAsync<AuthenticateResponseDTO>();
             return auth!.AccessToken;
        }

        [Fact]
        public async Task GetAllProducts_ReturnsOk()
        {
            var response = await _client.GetAsync("/api/product");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetProductById_NotFound_ReturnsNotFound()
        {
             var response = await _client.GetAsync("/api/product/99999");
             Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // Add more tests for Create/Update with Auth if needed.
        // Since we are using InMemory and authentication logic is complex (roles), 
        // we might stick to public endpoints first or setup admin user.
    }
}
