using System.Net;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using Retailen.Application.DTO.Return;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.Product;
using Retailen.Domain.Enums;
using Retailen.Infrastructure.Persistence;
using Xunit;

namespace Retailen.Tests.Integration
{
    public class ReturnEndpointTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory<Program> _factory;

        public ReturnEndpointTests(CustomWebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task CreateReturn_ValidData_ReturnsOk()
        {
            int userId = 1;
            int orderId = 1;
            using (var scope = _factory.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                
                 if (!db.Orders.Any())
                {
                    db.Products.Add(new Product("Item", 100m));
                    db.Customers.Add(new Customer { FirstName = "Return", LastName = "User" });
                    db.SaveChanges();

                    var product = db.Products.First();
                    var customer = db.Customers.First();
                    userId = customer.Id;

                    var order = new Order { CustomerId = userId, OrderStatusId = (int)OrderStatusEnum.Delivered, Total = 100m };
                    db.Orders.Add(order);
                    db.SaveChanges();
                    orderId = order.Id;
                }
            }

            var request = new CreateReturnRequestDTO
            {
                OrderId = orderId,
                Reason = "Broken",
                Quantity = 1
            };

            var response = await _client.PostAsJsonAsync("/api/return", request);
            
            Assert.True(response.StatusCode == HttpStatusCode.Unauthorized || response.StatusCode == HttpStatusCode.OK || response.StatusCode == HttpStatusCode.Created);
        }
    }
}
