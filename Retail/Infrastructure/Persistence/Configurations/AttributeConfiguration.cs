using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.Dictionary;
using Retailen.Domain.Entities.Product;
using Attribute = Retailen.Domain.Entities.Product.Attribute;

namespace Retailen.Infrastructure.Persistence.Configurations
{
    public class AttributeConfiguration : IEntityTypeConfiguration<Attribute>
    {
        public void Configure(EntityTypeBuilder<Attribute> entity)
        {
            entity.ToTable("Attribute");
            entity.HasKey(a => a.Id);
            entity.Property(a => a.Id).HasColumnName("AttributeID");
            entity.Property(a => a.Name).HasColumnName("Name")
                  .HasMaxLength(100).IsRequired();
            entity.Property(a => a.Code).HasColumnName("Code")
                  .HasColumnType("nvarchar(50)")
                  .HasMaxLength(50).IsRequired();
            entity.Property(a => a.DataType).HasColumnName("DataType")
                  .HasMaxLength(50).IsRequired();
            entity.Property(a => a.Unit).HasColumnName("Unit")
                  .HasMaxLength(20);

            entity.HasData(
                new Attribute { Id = 1, Code = "color",       Name = "Color",       DataType = "string" },
                new Attribute { Id = 2, Code = "material",    Name = "Material",    DataType = "string" },
                new Attribute { Id = 3, Code = "size",        Name = "Size",        DataType = "string" },
                new Attribute { Id = 4, Code = "screen_size", Name = "Screen Size", DataType = "decimal", Unit = "inch" },
                new Attribute { Id = 5, Code = "ram",         Name = "RAM",         DataType = "int",     Unit = "GB" },
                new Attribute { Id = 6, Code = "storage",     Name = "Storage",     DataType = "int",     Unit = "GB" },
                new Attribute { Id = 7, Code = "width",       Name = "Width",       DataType = "decimal", Unit = "cm" },
                new Attribute { Id = 8, Code = "height",      Name = "Height",      DataType = "decimal", Unit = "cm" },
                new Attribute { Id = 9, Code = "depth",       Name = "Depth",       DataType = "decimal", Unit = "cm" }
            );
        }
    }


    public class ProductAttributeConfiguration : IEntityTypeConfiguration<ProductAttribute>
    {
        public void Configure(EntityTypeBuilder<ProductAttribute> entity)
        {
            entity.ToTable("ProductAttribute");
            entity.HasKey(pa => pa.Id);
            entity.Property(pa => pa.Id).HasColumnName("ValueID");
            entity.Property(pa => pa.ProductId).HasColumnName("ProductID");
            entity.Property(pa => pa.AttributeId).HasColumnName("AttributeID");
            entity.Property(pa => pa.ValueString).HasColumnName("ValueString");
            entity.Property(pa => pa.ValueInt).HasColumnName("ValueInt");
            entity.Property(pa => pa.ValueDecimal).HasColumnName("ValueDecimal");
            entity.Property(pa => pa.ValueDate).HasColumnName("ValueDate");
            entity.Property(pa => pa.ValueBool).HasColumnName("ValueBool");

            entity.Property(pa => pa.CreatedAt)
                  .HasColumnName("CreatedAt")
                  .HasDefaultValueSql("SYSDATETIME()")
                  .ValueGeneratedOnAdd();

            entity.HasOne(pa => pa.Product)
                  .WithMany(p => p.ProductAttributes)
                  .HasForeignKey(pa => pa.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pa => pa.Attribute)
                  .WithMany()
                  .HasForeignKey(pa => pa.AttributeId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasData(
                new { Id = 1L,  ProductId = 2, AttributeId = 1, ValueString = "Black" },
                new { Id = 2L,  ProductId = 2, AttributeId = 3, ValueString = "M" },
                new { Id = 3L,  ProductId = 2, AttributeId = 2, ValueString = "Cotton" },
                new { Id = 5L,  ProductId = 1, AttributeId = 7, ValueString = "80" },
                new { Id = 6L,  ProductId = 1, AttributeId = 2, ValueString = "Bouclé" },
                new { Id = 7L,  ProductId = 1, AttributeId = 8, ValueString = "95" },
                new { Id = 8L,  ProductId = 1, AttributeId = 9, ValueString = "90" },
                new { Id = 4L,  ProductId = 3, AttributeId = 4, ValueString = "6.7" },
                new { Id = 9L,  ProductId = 3, AttributeId = 5, ValueString = "12" },
                new { Id = 10L, ProductId = 3, AttributeId = 6, ValueString = "256" },
                new { Id = 11L, ProductId = 4, AttributeId = 4, ValueString = "15.6" },
                new { Id = 12L, ProductId = 4, AttributeId = 5, ValueString = "16" },
                new { Id = 13L, ProductId = 4, AttributeId = 6, ValueString = "512" },
                new { Id = 14L, ProductId = 5, AttributeId = 7, ValueString = "200" },
                new { Id = 15L, ProductId = 5, AttributeId = 8, ValueString = "85" },
                new { Id = 16L, ProductId = 5, AttributeId = 9, ValueString = "95" },
                new { Id = 17L, ProductId = 5, AttributeId = 2, ValueString = "Velvet" },
                new { Id = 18L, ProductId = 6, AttributeId = 1, ValueString = "Blue" },
                new { Id = 19L, ProductId = 6, AttributeId = 3, ValueString = "32/34" },
                new { Id = 20L, ProductId = 6, AttributeId = 2, ValueString = "Denim" }
            );
        }
    }

    public class AttributeColorConfiguration : IEntityTypeConfiguration<AttributeColor>
    {
        public void Configure(EntityTypeBuilder<AttributeColor> entity)
        {
            entity.ToTable("AttributeColor");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("ColorID");
            entity.Property(e => e.Name).HasColumnName("Name").IsRequired().HasMaxLength(50);
        }
    }

    public class AttributeMaterialConfiguration : IEntityTypeConfiguration<AttributeMaterial>
    {
        public void Configure(EntityTypeBuilder<AttributeMaterial> entity)
        {
            entity.ToTable("AttributeMaterial");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("MaterialID");
            entity.Property(e => e.Name).HasColumnName("Name").IsRequired().HasMaxLength(50);
        }
    }

    public class AttributeSizeConfiguration : IEntityTypeConfiguration<AttributeSize>
    {
        public void Configure(EntityTypeBuilder<AttributeSize> entity)
        {
            entity.ToTable("AttributeSize");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("SizeID");
            entity.Property(e => e.Name).HasColumnName("Name").IsRequired().HasMaxLength(50);
        }
    }
}
