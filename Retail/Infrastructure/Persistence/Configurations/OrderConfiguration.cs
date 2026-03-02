using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.History;

namespace Retailen.Infrastructure.Persistence.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> entity)
        {
            entity.ToTable("Order");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("OrderID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.OrderStatusId).HasColumnName("OrderStatusID");
            entity.Property(e => e.Total).HasColumnName("TotalAmount")
                  .HasColumnType("decimal(18,2)");
            entity.Property(e => e.OrderDate).HasColumnName("OrderDate");

            entity.HasOne(e => e.OrderStatusEntity)
                  .WithMany()
                  .HasForeignKey(e => e.OrderStatusId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Customer)
                  .WithMany(c => c.Orders)
                  .HasForeignKey(e => e.CustomerId)
                  .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> entity)
        {
            entity.ToTable("OrderItem");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("OrderItemID");
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.Quantity).HasColumnName("Quantity");
            entity.Property(e => e.UnitPrice).HasColumnName("UnitPrice")
                  .HasColumnType("decimal(18,2)");

            entity.HasOne(e => e.Order)
                  .WithMany(o => o.Items)
                  .HasForeignKey(e => e.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Product)
                  .WithMany()
                  .HasForeignKey(e => e.ProductId)
                  .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class OrderStatusEntityConfiguration : IEntityTypeConfiguration<OrderStatusEntity>
    {
        public void Configure(EntityTypeBuilder<OrderStatusEntity> entity)
        {
            entity.ToTable("OrderStatus");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("OrderStatusID");
            entity.Property(e => e.Name).HasColumnName("Name")
                  .IsRequired().HasMaxLength(50);
            entity.Property(e => e.Description).HasColumnName("Description");

            entity.HasData(
                new { Id = 1, Name = "AwaitingPayment", Description = "Order created, awaiting payment" },
                new { Id = 2, Name = "Paid",            Description = "Payment received, ready to process" },
                new { Id = 3, Name = "Processing",      Description = "Picking and packing" },
                new { Id = 4, Name = "Shipped",         Description = "Shipped to customer" },
                new { Id = 5, Name = "Delivered",       Description = "Delivered to customer" },
                new { Id = 6, Name = "Cancelled",       Description = "Order cancelled" }
            );
        }
    }

    public class OrderStatusHistoryConfiguration : IEntityTypeConfiguration<OrderStatusHistory>
    {
        public void Configure(EntityTypeBuilder<OrderStatusHistory> entity)
        {
            entity.ToTable("OrderStatusHistory");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.OrderStatusId).HasColumnName("OrderStatusID");

            entity.HasOne<Order>()
                  .WithMany()
                  .HasForeignKey(e => e.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class OrderBillingInfoConfiguration : IEntityTypeConfiguration<OrderBillingInfo>
    {
        public void Configure(EntityTypeBuilder<OrderBillingInfo> entity)
        {
            entity.ToTable("OrderBillingInfo");
            entity.HasKey(e => e.OrderId);
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
        }
    }

    public class OrderShippingAddressConfiguration : IEntityTypeConfiguration<OrderShippingAddress>
    {
        public void Configure(EntityTypeBuilder<OrderShippingAddress> entity)
        {
            entity.ToTable("OrderShippingAddress");
            entity.HasKey(e => e.OrderId);
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.PhoneNumber).HasMaxLength(50);
            entity.Property(e => e.StreetAddress).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Apartment).HasMaxLength(100);
            entity.Property(e => e.City).IsRequired().HasMaxLength(100);
            entity.Property(e => e.State).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ZipCode).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Country).IsRequired().HasMaxLength(100);

            entity.HasOne(e => e.Order)
                  .WithOne(o => o.ShippingAddress)
                  .HasForeignKey<OrderShippingAddress>(e => e.OrderId);
        }
    }
}
