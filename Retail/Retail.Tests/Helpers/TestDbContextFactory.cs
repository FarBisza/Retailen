using Microsoft.EntityFrameworkCore;
using Retailen.Infrastructure.Persistence;

namespace Retailen.Tests.Helpers
{
    public static class TestDbContextFactory
    {
        public static AppDbContext Create(string? dbName = null)
        {
            dbName ??= Guid.NewGuid().ToString();

            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;

            var context = new AppDbContext(options);
            context.Database.EnsureCreated();
            return context;
        }

        public static void ClearData(AppDbContext context)
        {
            context.ChangeTracker.Clear();
            context.Products.RemoveRange(context.Products);
            context.Categories.RemoveRange(context.Categories);
            context.Orders.RemoveRange(context.Orders);
            context.Customers.RemoveRange(context.Customers);
            context.Carts.RemoveRange(context.Carts);
            context.Returns.RemoveRange(context.Returns);
            context.SaveChanges();
        }
    }
}
