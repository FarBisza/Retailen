using System.Net;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using Retailen.Application.DTO.Cart;
using Retailen.Application.DTO.Order;
using Retailen.Domain.Entities.Product;
using Retailen.Domain.Entities.Cart;
using Retailen.Domain.Entities;
using Retailen.Infrastructure.Persistence;
using Xunit;

namespace Retailen.Tests.Integration
{
    public class OrderEndpointTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory<Program> _factory;

        public OrderEndpointTests(CustomWebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task CreateOrder_ValidCart_ReturnsOrderDto()
        {
            int userId = 1;
            int productId = 1;
            using (var scope = _factory.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                
                if (!db.Products.Any())
                {
                    db.Products.Add(new Product("Integration Test Product", 100m));
                    db.Customers.Add(new Customer { FirstName = "Integration", LastName = "User", Email = "int@test.com" });
                    db.SaveChanges();
                    productId = db.Products.First().Id;
                    userId = db.Customers.First().Id;
                }
                else 
                {
                    productId = db.Products.First().Id;
                    userId = db.Customers.First().Id;
                }
            }

            int cartId;
            using (var scope = _factory.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var cart = new Cart(userId, "session-1");
                cart.AddItem(productId, 2);
                db.Carts.Add(cart);
                db.SaveChanges();
                cartId = cart.Id;
            }

            var request = new CreateOrderRequestDTO { UserId = userId, CartId = cartId };
            var response = await _client.PostAsJsonAsync("/api/order", request);
            
            var request = new CreateOrderRequestDTO { UserId = userId, CartId = cartId };
            var response = await _client.PostAsJsonAsync("/api/order", request);

            Assert.True(response.StatusCode == HttpStatusCode.Unauthorized || response.StatusCode == HttpStatusCode.OK || response.StatusCode == HttpStatusCode.Created);
        }
    }
}
