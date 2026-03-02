using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Retailen.Domain.Entities.Product;

namespace Retailen.Infrastructure.Persistence.Configurations
{
    public class ReviewConfiguration : IEntityTypeConfiguration<Review>
    {
        public void Configure(EntityTypeBuilder<Review> entity)
        {
            entity.ToTable("Review");
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Id).HasColumnName("ReviewID");
            entity.Property(r => r.ProductId).HasColumnName("ProductID");
            entity.Property(r => r.CustomerId).HasColumnName("CustomerID");
            entity.Property(r => r.OrderItemId).HasColumnName("OrderItemID");
            entity.Property(r => r.Rating).HasColumnName("Rating");
            entity.Property(r => r.Title).HasColumnName("Title")
                  .HasMaxLength(200);
            entity.Property(r => r.Content).HasColumnName("Content");
            entity.Property(r => r.CreatedAt).HasColumnName("CreatedAt");
            entity.Property(r => r.ModerationStatus).HasColumnName("ModerationStatus")
                  .IsRequired().HasMaxLength(30);

            entity.HasOne(r => r.Product)
                  .WithMany(p => p.Reviews)
                  .HasForeignKey(r => r.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
