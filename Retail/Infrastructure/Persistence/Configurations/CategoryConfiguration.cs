using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.Product;

namespace Retailen.Infrastructure.Persistence.Configurations
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> entity)
        {
            entity.ToTable("Category");
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Id).HasColumnName("CategoryID");
            entity.Property(c => c.ParentId).HasColumnName("ParentID");
            entity.Property(c => c.Name).HasColumnName("Name")
                  .IsRequired().HasMaxLength(100);

            entity.HasOne(c => c.Parent)
                  .WithMany(c => c.Children)
                  .HasForeignKey(c => c.ParentId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasData(
                new { Id = 1,  Name = "Electronics",   ParentId = (int?)null },
                new { Id = 2,  Name = "Clothing",      ParentId = (int?)null },
                new { Id = 3,  Name = "Furniture",     ParentId = (int?)null },
                // Furniture
                new { Id = 4,  Name = "Ottomans & Poufs",              ParentId = 3 },
                new { Id = 5,  Name = "Dressers & Chests",             ParentId = 3 },
                new { Id = 6,  Name = "Dining & Kitchen Furniture",    ParentId = 3 },
                new { Id = 7,  Name = "Sideboards & Buffets",          ParentId = 3 },
                new { Id = 8,  Name = "Kitchen Islands & Carts",       ParentId = 3 },
                new { Id = 9,  Name = "Bookcases & Bookshelves",       ParentId = 3 },
                new { Id = 10, Name = "Credenzas & Hutches",           ParentId = 3 },
                new { Id = 11, Name = "Patio Dining Sets",             ParentId = 3 },
                // Electronics
                new { Id = 12, Name = "Smartphones",                   ParentId = 1 },
                new { Id = 13, Name = "Audio & Headphones",            ParentId = 1 },
                new { Id = 14, Name = "Laptops & Computers",           ParentId = 1 },
                new { Id = 15, Name = "Smart Home",                    ParentId = 1 },
                new { Id = 16, Name = "Wearables",                     ParentId = 1 },
                // Clothing
                new { Id = 17, Name = "Men's Apparel",                 ParentId = 2 },
                new { Id = 18, Name = "Women's Apparel",               ParentId = 2 },
                new { Id = 19, Name = "Essentials",                    ParentId = 2 },
                new { Id = 20, Name = "Accessories",                   ParentId = 2 }
            );
        }
    }

    public class ProductCategoryConfiguration : IEntityTypeConfiguration<ProductCategory>
    {
        public void Configure(EntityTypeBuilder<ProductCategory> entity)
        {
            entity.ToTable("ProductCategory");
            entity.HasKey(pc => new { pc.ProductId, pc.CategoryId });
            entity.Property(pc => pc.ProductId).HasColumnName("ProductID");
            entity.Property(pc => pc.CategoryId).HasColumnName("CategoryID");

            entity.HasOne(pc => pc.Product)
                  .WithMany(p => p.ProductCategories)
                  .HasForeignKey(pc => pc.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pc => pc.Category)
                  .WithMany(c => c.ProductCategories)
                  .HasForeignKey(pc => pc.CategoryId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasData(
                new { ProductId = 1, CategoryId = 3 },
                new { ProductId = 2, CategoryId = 2 },
                new { ProductId = 3, CategoryId = 1 }
            );
        }
    }

    public class CategoryAttributeConfiguration : IEntityTypeConfiguration<CategoryAttribute>
    {
        public void Configure(EntityTypeBuilder<CategoryAttribute> entity)
        {
            entity.ToTable("CategoryAttribute");
            entity.HasKey(ca => new { ca.CategoryId, ca.AttributeId });
            entity.Property(ca => ca.CategoryId).HasColumnName("CategoryID");
            entity.Property(ca => ca.AttributeId).HasColumnName("AttributeID");
            entity.Property(ca => ca.IsRequired).HasColumnName("IsRequired");
            entity.Property(ca => ca.SortOrder).HasColumnName("SortOrder");

            entity.HasOne(ca => ca.Category)
                  .WithMany(c => c.Attributes)
                  .HasForeignKey(ca => ca.CategoryId);

            entity.HasOne(ca => ca.Attribute)
                  .WithMany()
                  .HasForeignKey(ca => ca.AttributeId);

            entity.HasData(
                // Electronics (1)
                new CategoryAttribute { CategoryId = 1, AttributeId = 4, IsRequired = true,  SortOrder = 1 },
                new CategoryAttribute { CategoryId = 1, AttributeId = 5, IsRequired = true,  SortOrder = 2 },
                new CategoryAttribute { CategoryId = 1, AttributeId = 6, IsRequired = true,  SortOrder = 3 },
                // Clothing (2)
                new CategoryAttribute { CategoryId = 2, AttributeId = 1, IsRequired = true,  SortOrder = 1 },
                new CategoryAttribute { CategoryId = 2, AttributeId = 3, IsRequired = true,  SortOrder = 2 },
                new CategoryAttribute { CategoryId = 2, AttributeId = 2, IsRequired = false, SortOrder = 3 },
                // Furniture (3)
                new CategoryAttribute { CategoryId = 3, AttributeId = 7, IsRequired = true,  SortOrder = 1 },
                new CategoryAttribute { CategoryId = 3, AttributeId = 8, IsRequired = true,  SortOrder = 2 },
                new CategoryAttribute { CategoryId = 3, AttributeId = 9, IsRequired = false, SortOrder = 3 },
                new CategoryAttribute { CategoryId = 3, AttributeId = 2, IsRequired = false, SortOrder = 4 }
            );
        }
    }
}
