using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Retailen.Domain.Entities.Logistics;
using Retailen.Domain.Entities.Logistics.Deliveries.DeliveryDictionary;
using Retailen.Domain.Entities.Logistics.Deliveries.Supplier;

namespace Retailen.Infrastructure.Persistence.Configurations
{
    public class SupplierConfiguration : IEntityTypeConfiguration<Supplier>
    {
        public void Configure(EntityTypeBuilder<Supplier> entity)
        {
            entity.ToTable("Supplier");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("SupplierID");
            entity.Property(e => e.Name).HasColumnName("Name")
                  .IsRequired().HasMaxLength(255);
            entity.Property(e => e.Active).HasColumnName("IsActive");
        }
    }

    public class PurchaseOrderConfiguration : IEntityTypeConfiguration<PurchaseOrder>
    {
        public void Configure(EntityTypeBuilder<PurchaseOrder> entity)
        {
            entity.ToTable("PurchaseOrder", t => t.HasTrigger("trg_PurchaseOrder"));
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("PurchaseOrderID");
            entity.Property(e => e.SupplierId).HasColumnName("SupplierID");
            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");
            entity.Property(e => e.CreatedAt).HasColumnName("CreatedAt");
            entity.Property(e => e.ExpectedDate).HasColumnName("ExpectedDate");

            entity.HasOne(e => e.Supplier)
                  .WithMany(s => s.PurchaseOrders)
                  .HasForeignKey(e => e.SupplierId);

            entity.HasOne(e => e.Status)
                  .WithMany()
                  .HasForeignKey(e => e.StatusId);

            entity.HasOne(e => e.Warehouse)
                  .WithMany()
                  .HasForeignKey(e => e.WarehouseId);
        }
    }

    public class PurchaseOrderItemConfiguration : IEntityTypeConfiguration<PurchaseOrderItem>
    {
        public void Configure(EntityTypeBuilder<PurchaseOrderItem> entity)
        {
            entity.ToTable("PurchaseOrderItem");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("PurchaseOrderItemID");
            entity.Property(e => e.PurchaseOrderId).HasColumnName("PurchaseOrderID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.QuantityOrdered).HasColumnName("QuantityOrdered");
            entity.Property(e => e.PurchasePrice).HasColumnName("PurchasePrice")
                  .HasPrecision(18, 4);

            entity.HasOne(e => e.PurchaseOrder)
                  .WithMany(po => po.Items)
                  .HasForeignKey(e => e.PurchaseOrderId);
        }
    }

    public class PurchaseOrderStatusConfiguration : IEntityTypeConfiguration<PurchaseOrderStatus>
    {
        public void Configure(EntityTypeBuilder<PurchaseOrderStatus> entity)
        {
            entity.ToTable("PurchaseOrderStatus");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("StatusID");
            entity.Property(e => e.Name).HasColumnName("Name");
            entity.Property(e => e.Description).HasColumnName("Description");

            entity.HasData(
                new { Id = 1, Name = "Draft",              Description = "Created as draft" },
                new { Id = 2, Name = "SentToSupplier",     Description = "Sent to supplier" },
                new { Id = 3, Name = "Confirmed",          Description = "Confirmed by supplier" },
                new { Id = 4, Name = "InDelivery",         Description = "In transit from supplier" },
                new { Id = 5, Name = "FullyReceived",      Description = "Fully received" },
                new { Id = 6, Name = "PartiallyReceived",  Description = "Partially received" },
                new { Id = 7, Name = "Cancelled",          Description = "Purchase order cancelled" }
            );
        }
    }
}
