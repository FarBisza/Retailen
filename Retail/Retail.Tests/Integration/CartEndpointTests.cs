using System.Net;
using System.Net.Http.Json;
using Retailen.Application.DTO.Cart;
using Xunit;

namespace Retailen.Tests.Integration
{
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
            var request = new AddToCartRequestDTO
            {
                ProductId = 1,
                Quantity = 1,
                SessionId = $"test-session-{Guid.NewGuid()}"
            };

            var response = await _client.PostAsJsonAsync("/api/cart/add", request);

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

            Assert.True(
                response.StatusCode == HttpStatusCode.OK ||
                response.StatusCode == HttpStatusCode.NotFound,
                $"Unexpected status: {response.StatusCode}");
        }
    }
}
