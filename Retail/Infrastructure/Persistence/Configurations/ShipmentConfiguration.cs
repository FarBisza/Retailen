using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.Logistics.Deliveries.DeliveryDictionary;

namespace Retailen.Infrastructure.Persistence.Configurations
{
    public class ShipmentConfiguration : IEntityTypeConfiguration<Shipment>
    {
        public void Configure(EntityTypeBuilder<Shipment> entity)
        {
            entity.ToTable("Shipment");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("ShipmentID");
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");
            entity.Property(e => e.TrackingNumber).HasColumnName("TrackingNumber");
            entity.Property(e => e.ShipDate).HasColumnName("ShippedDate");
            entity.Property(e => e.DeliveryDate).HasColumnName("DeliveredDate");
            entity.Property(e => e.ShipmentStatusId).HasColumnName("ShipmentStatusID");

            entity.HasOne(e => e.Order)
                  .WithMany(o => o.Shipments)
                  .HasForeignKey(e => e.OrderId);

            entity.HasOne(e => e.Warehouse)
                  .WithMany()
                  .HasForeignKey(e => e.WarehouseId);

            entity.HasOne(e => e.Status)
                  .WithMany()
                  .HasForeignKey(e => e.ShipmentStatusId);
        }
    }

    public class ShipmentItemConfiguration : IEntityTypeConfiguration<ShipmentItem>
    {
        public void Configure(EntityTypeBuilder<ShipmentItem> entity)
        {
            entity.ToTable("ShipmentItem");
            entity.HasKey(e => new { e.ShipmentId, e.OrderItemId });
            entity.Property(e => e.ShipmentId).HasColumnName("ShipmentID");
            entity.Property(e => e.OrderItemId).HasColumnName("OrderItemID");
            entity.Property(e => e.Quantity).HasColumnName("Quantity");

            entity.HasOne(e => e.Shipment)
                  .WithMany(s => s.Items)
                  .HasForeignKey(e => e.ShipmentId);

            entity.HasOne(e => e.OrderItem)
                  .WithMany()
                  .HasForeignKey(e => e.OrderItemId)
                  .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class ShipmentStatusConfiguration : IEntityTypeConfiguration<ShipmentStatus>
    {
        public void Configure(EntityTypeBuilder<ShipmentStatus> entity)
        {
            entity.ToTable("ShipmentStatus");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("ShipmentStatusID");
            entity.Property(e => e.Name).HasColumnName("Name");
            entity.Property(e => e.Description).HasColumnName("Description");

            entity.HasData(
                new { Id = 1, Name = "Created",    Description = "Created, not yet shipped" },
                new { Id = 2, Name = "Dispatched", Description = "Handed to carrier" },
                new { Id = 3, Name = "InTransit",  Description = "In transit" },
                new { Id = 4, Name = "Delivered",  Description = "Delivered to customer" },
                new { Id = 5, Name = "Cancelled",  Description = "Shipment cancelled" }
            );
        }
    }

    public class ShipmentStatusHistoryConfiguration : IEntityTypeConfiguration<ShipmentStatusHistory>
    {
        public void Configure(EntityTypeBuilder<ShipmentStatusHistory> entity)
        {
            entity.ToTable("ShipmentStatusHistory");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("Id");
            entity.Property(e => e.ShipmentId).HasColumnName("ShipmentID");
            entity.Property(e => e.ShipmentStatusId).HasColumnName("ShipmentStatusID");
            entity.Property(e => e.ChangedAt).HasColumnName("ChangedAt");
            entity.Property(e => e.Comment).HasColumnName("Comment");
        }
    }
}
