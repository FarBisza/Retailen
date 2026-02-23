using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace Retailen.Tests.Integration
{
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
            var response = await _client.PostAsync("/api/payment/invoice/1", null);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
    }
}
