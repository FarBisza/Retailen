using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.History;

namespace Retailen.Infrastructure.Persistence.Configurations
{
    public class InventoryConfiguration : IEntityTypeConfiguration<Inventory>
    {
        public void Configure(EntityTypeBuilder<Inventory> entity)
        {
            entity.ToTable("Inventory", t => t.HasTrigger("trg_Inventory"));
            entity.HasKey(e => new { e.ProductId, e.WarehouseId });
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");
            entity.Property(e => e.Quantity).HasColumnName("Quantity");
            entity.Property(e => e.UpdatedAt).HasColumnName("UpdatedAt");

            entity.HasOne(e => e.Product)
                  .WithMany()
                  .HasForeignKey(e => e.ProductId);
        }
    }

    public class InventoryHistoryConfiguration : IEntityTypeConfiguration<InventoryHistory>
    {
        public void Configure(EntityTypeBuilder<InventoryHistory> entity)
        {
            entity.ToTable("InventoryHistory", t => t.HasTrigger("trg_InventoryHistory"));
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("HistoryID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.EventType).HasColumnName("EventType");
            entity.Property(e => e.QuantityChange).HasColumnName("QuantityChange");
            entity.Property(e => e.QuantityBefore).HasColumnName("QuantityBefore");
            entity.Property(e => e.QuantityAfter).HasColumnName("QuantityAfter");

            entity.HasOne<Order>()
                  .WithMany()
                  .HasForeignKey(e => e.OrderId)
                  .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
