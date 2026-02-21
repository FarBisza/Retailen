using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Retailen.Domain.Entities;

namespace Retailen.Infrastructure.Persistence.Configurations
{
    public class ReturnConfiguration : IEntityTypeConfiguration<Return>
    {
        public void Configure(EntityTypeBuilder<Return> entity)
        {
            entity.ToTable("Return");
            entity.HasKey(r => r.ReturnId);
            entity.Property(r => r.ReturnId).HasColumnName("ReturnID");
            entity.Property(r => r.OrderId).HasColumnName("OrderID");
            entity.Property(r => r.CustomerId).HasColumnName("CustomerID");
            entity.Property(r => r.ReturnStatusId).HasColumnName("ReturnStatusID")
                  .HasDefaultValue(1);
            entity.Property(r => r.OrderItemId).HasColumnName("OrderItemID");
            entity.Property(r => r.Quantity).HasColumnName("Quantity")
                  .HasDefaultValue(1);
            entity.Property(r => r.Reason).HasColumnName("Reason")
                  .HasMaxLength(100);
            entity.Property(r => r.Description).HasColumnName("Description")
                  .HasMaxLength(500);
            entity.Property(r => r.RefundAmount).HasColumnName("RefundAmount")
                  .HasColumnType("decimal(12,2)");
            entity.Property(r => r.ApprovalDate).HasColumnName("ApprovedDate");
            entity.Property(r => r.RefundDate).HasColumnName("ReturnDate");
            entity.Property(r => r.AdminNote).HasColumnName("AdminNote")
                  .HasMaxLength(500);
            entity.Property(r => r.CreatedAt).HasColumnName("CreatedAt");
            entity.Property(r => r.UpdatedAt).HasColumnName("UpdatedAt");

            entity.HasOne(r => r.Order)
                  .WithMany()
                  .HasForeignKey(r => r.OrderId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.Customer)
                  .WithMany()
                  .HasForeignKey(r => r.CustomerId)
                  .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
