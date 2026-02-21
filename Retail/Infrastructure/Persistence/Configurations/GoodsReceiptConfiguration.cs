using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Retailen.Domain.Entities.Logistics.GoodsReceipt;

namespace Retailen.Infrastructure.Persistence.Configurations
{
    public class GoodsReceiptConfiguration : IEntityTypeConfiguration<GoodsReceipt>
    {
        public void Configure(EntityTypeBuilder<GoodsReceipt> entity)
        {
            entity.ToTable("GoodsReceipt", t => t.HasTrigger("trg_GoodsReceipt"));
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("GoodsReceiptID");
            entity.Property(e => e.PurchaseOrderId).HasColumnName("PurchaseOrderID");
            entity.Property(e => e.WarehouseId).HasColumnName("WarehouseID");
            entity.Property(e => e.DocumentNumber).HasColumnName("DocumentNumber");
            entity.Property(e => e.ReceiptDate).HasColumnName("ReceivedDate");
            entity.Property(e => e.ShippingCost).HasColumnName("ShippingCost")
                  .HasPrecision(18, 4);
            entity.Property(e => e.Comment).HasColumnName("Comment");

            entity.HasOne(e => e.Warehouse)
                  .WithMany()
                  .HasForeignKey(e => e.WarehouseId);
        }
    }

    public class GoodsReceiptItemConfiguration : IEntityTypeConfiguration<GoodsReceiptItem>
    {
        public void Configure(EntityTypeBuilder<GoodsReceiptItem> entity)
        {
            entity.ToTable("GoodsReceiptItem", t => t.HasTrigger("trg_GoodsReceiptItem"));
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("GoodsReceiptItemID");
            entity.Property(e => e.GoodsReceiptId).HasColumnName("GoodsReceiptID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.QuantityReceived).HasColumnName("QuantityReceived");
            entity.Property(e => e.QuantityDamaged).HasColumnName("QuantityDamaged");

            entity.HasOne(e => e.GoodsReceipt)
                  .WithMany(gr => gr.Items)
                  .HasForeignKey(e => e.GoodsReceiptId);
        }
    }

    public class GoodsReceiptDiscrepancyConfiguration : IEntityTypeConfiguration<GoodsReceiptDiscrepancy>
    {
        public void Configure(EntityTypeBuilder<GoodsReceiptDiscrepancy> entity)
        {
            entity.ToTable("GoodsReceiptDiscrepancy", t => t.HasTrigger("trg_GoodsReceiptDiscrepancy"));
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("DiscrepancyID");
            entity.Property(e => e.GoodsReceiptId).HasColumnName("GoodsReceiptID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.Type).HasColumnName("Type")
                  .IsRequired().HasMaxLength(40);
            entity.Property(e => e.Quantity).HasColumnName("Quantity");
            entity.Property(e => e.Description).HasColumnName("Description");

            entity.HasOne(e => e.GoodsReceipt)
                  .WithMany(gr => gr.Discrepancies)
                  .HasForeignKey(e => e.GoodsReceiptId);
        }
    }
}
