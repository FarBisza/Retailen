using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace Retailen.Tests.Integration
{
    /// <summary>
    /// Integration tests for Payment API endpoints — verifies
    /// that payment endpoints require authentication (JWT).
    /// </summary>
    public class PaymentEndpointTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public PaymentEndpointTests(CustomWebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GenerateInvoice_Unauthorized_Returns401()
        {
            // Attempt to generate invoice without authentication token
            var response = await _client.PostAsync("/api/payment/invoice/1", null);

            // Payment endpoints should be protected by [Authorize]
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
    }
}
