using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Retailen.Domain.Entities.Product;

namespace Retailen.Infrastructure.Persistence.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> entity)
        {
            entity.ToTable("Product");
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Id).HasColumnName("ProductID");
            entity.Property(p => p.Name).HasColumnName("Name")
                  .HasMaxLength(255).IsRequired();
            entity.Property(p => p.Description).HasColumnName("Description")
                  .HasMaxLength(1000);
            entity.Property(p => p.Price).HasColumnName("Price")
                  .HasColumnType("decimal(10, 2)");
            entity.Property(p => p.ImageUrl).HasColumnName("ImageUrl")
                  .HasMaxLength(500);
            entity.Property(p => p.Active).HasColumnName("IsActive");
            entity.Property(p => p.CreatedAt).HasColumnName("CreatedAt");

            var seedDate = new DateTime(2026, 2, 8, 0, 0, 0, DateTimeKind.Utc);
            entity.HasData(
                new { Id = 1, Name = "Rune 38\" Bouclé Accent Chair", Price = 449.95m, Active = true, CreatedAt = seedDate },
                new { Id = 2, Name = "Essential Cotton T-Shirt", Price = 29.99m, Active = true, CreatedAt = seedDate },
                new { Id = 3, Name = "Pro Smartphone X", Price = 999.00m, Active = true, CreatedAt = seedDate }
            );
        }
    }
}
