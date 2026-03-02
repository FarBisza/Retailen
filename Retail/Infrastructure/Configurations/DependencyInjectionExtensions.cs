using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Retailen.Application.Interfaces;
using Retailen.Application.Mappings;
using Retailen.Application.Services;
using Retailen.Domain.Entities.Logistics.Deliveries.DeliveryDictionary;
using Retailen.Domain.Interfaces;
using Retailen.Infrastructure.Persistence;
using Retailen.Infrastructure.Repositories;
using Retailen.Infrastructure.Services;

namespace Retailen.Infrastructure.Configurations
{
    public static class DependencyInjectionExtensions
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services, IConfiguration configuration)
        {
            // AutoMapper
            services.AddAutoMapper(typeof(Retailen.Application.Mappings.CartMappingProfile));

            // FluentValidation
            services.AddValidatorsFromAssemblyContaining<Retailen.Application.Validators.Auth.RegisterRequestValidator>();

            // Database
            if (configuration.GetValue<bool>("UseInMemoryDatabase"))
            {
                var dbName = configuration.GetValue<string>("InMemoryDatabaseName") ?? "RetailDb";
                services.AddDbContext<AppDbContext>(options =>
                    options.UseInMemoryDatabase(dbName));
            }
            else
            {
                services.AddDbContext<AppDbContext>(options =>
                    options.UseSqlServer(
                        configuration.GetConnectionString("DefaultConnection"),
                        sqlOptions => sqlOptions.EnableRetryOnFailure(
                            maxRetryCount: 5,
                            maxRetryDelay: TimeSpan.FromSeconds(30),
                            errorNumbersToAdd: null)));
            }

            // --- SERVICES ---
            services.AddTransient<IEmailService, EmailService>();
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<IPasswordService, PasswordService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<ILogisticsService, LogisticsService>();
            services.AddScoped<IReturnService, ReturnService>();
            services.AddScoped<IInventoryService, InventoryService>();
            services.AddScoped<IAttributeService, AttributeService>();

            // --- REPOSITORIES ---
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<ICartRepository, CartRepository>();
            services.AddScoped<IInventoryRepository, InventoryRepository>();
            services.AddScoped<IAttributeRepository, AttributeRepository>();
            services.AddScoped<IReturnRepository, ReturnRepository>();
            services.AddScoped<IPurchaseOrderRepository, PurchaseOrderRepository>();
            services.AddScoped<IGoodsReceiptRepository, GoodsReceiptRepository>();
            services.AddScoped<IInvoiceRepository, InvoiceRepository>();
            services.AddScoped<IPaymentRepository, PaymentRepository>();
            services.AddScoped<IShipmentRepository, ShipmentRepository>();

            return services;
        }
    }
}