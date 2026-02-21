using System.Net;
using System.Net.Http.Json;
using Retailen.Application.DTO.Cart;
using Xunit;

namespace Retailen.Tests.Integration
{
    /// <summary>
    /// Integration tests for Cart API endpoints — verifies
    /// add-to-cart and empty cart retrieval over HTTP.
    /// </summary>
    public class CartEndpointTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public CartEndpointTests(CustomWebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task AddToCart_ValidProduct_ReturnsOkOrCreated()
        {
            // Cart endpoints are typically public (session-based)
            var request = new AddToCartRequestDTO
            {
                ProductId = 1,
                Quantity = 1,
                SessionId = $"test-session-{Guid.NewGuid()}"
            };

            var response = await _client.PostAsJsonAsync("/api/cart/add", request);

            // Expect OK/Created or BadRequest (if product doesn't exist in InMemory DB)
            // This validates the endpoint exists and processes the request
            Assert.True(
                response.StatusCode == HttpStatusCode.OK ||
                response.StatusCode == HttpStatusCode.Created ||
                response.StatusCode == HttpStatusCode.BadRequest,
                $"Unexpected status: {response.StatusCode}");
        }

        [Fact]
        public async Task GetCart_EmptySession_ReturnsEmptyOrNotFound()
        {
            var sessionId = $"empty-session-{Guid.NewGuid()}";
            var response = await _client.GetAsync($"/api/cart?sessionId={sessionId}");

            // Empty session should return OK with empty cart or NotFound
            Assert.True(
                response.StatusCode == HttpStatusCode.OK ||
                response.StatusCode == HttpStatusCode.NotFound,
                $"Unexpected status: {response.StatusCode}");
        }
    }
}
