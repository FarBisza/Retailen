using Microsoft.EntityFrameworkCore;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.Cart;
using Retailen.Domain.Entities.Product;
using Attribute = Retailen.Domain.Entities.Product.Attribute;
using Retailen.Domain.Entities.Logistics.Deliveries.Supplier;
using Retailen.Domain.Entities.Logistics.Deliveries.DeliveryDictionary;
using Retailen.Domain.Entities.Logistics.GoodsReceipt;
using Retailen.Domain.Entities.Logistics;
using Retailen.Domain.Entities.History;
using Retailen.Domain.Entities.Dictionary;

namespace Retailen.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // ── Identity ──
        public DbSet<Role> Roles { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        // ── Shopping Cart ──
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

        // ── Products & Attributes ──
        public DbSet<Product> Products { get; set; }
        public DbSet<Attribute> Attributes { get; set; }
        public DbSet<ProductAttribute> ProductAttributes { get; set; }
        public DbSet<AttributeColor> AttributeColors { get; set; }
        public DbSet<AttributeMaterial> AttributeMaterials { get; set; }
        public DbSet<AttributeSize> AttributeSizes { get; set; }
        public DbSet<Review> Reviews { get; set; }

        // ── Categories ──
        public DbSet<Category> Categories { get; set; }
        public DbSet<CategoryAttribute> CategoryAttributes { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }

        // ── Inventory ──
        public DbSet<Inventory> Inventory { get; set; }

        // ── Orders ──
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<PaymentType> PaymentTypes { get; set; }
        public DbSet<Shipment> Shipments { get; set; }
        public DbSet<OrderBillingInfo> OrderBillingInfo { get; set; }
        public DbSet<InventoryHistory> InventoryHistory { get; set; }
        public DbSet<OrderStatusHistory> OrderStatusHistory { get; set; }

        // ── Logistics ──
        public DbSet<ShipmentItem> ShipmentItems { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }
        public DbSet<GoodsReceipt> GoodsReceipts { get; set; }
        public DbSet<GoodsReceiptItem> GoodsReceiptItems { get; set; }
        public DbSet<ShipmentStatus> ShipmentStatuses { get; set; }
        public DbSet<PurchaseOrderStatus> PurchaseOrderStatuses { get; set; }
        public DbSet<ShipmentStatusHistory> ShipmentStatusHistory { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<GoodsReceiptDiscrepancy> ReceiptDiscrepancies { get; set; }
        public DbSet<OrderShippingAddress> OrderShippingAddresses { get; set; }

        // ── Returns ──
        public DbSet<Return> Returns { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}