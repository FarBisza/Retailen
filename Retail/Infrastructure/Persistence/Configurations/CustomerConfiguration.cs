using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Retailen.Domain.Entities;

namespace Retailen.Infrastructure.Persistence.Configurations
{
    public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> entity)
        {
            entity.ToTable("Customer");
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Id).HasColumnName("CustomerID");
            entity.Property(c => c.HashedPassword).HasColumnName("PasswordHash");
            entity.Property(c => c.Email).IsRequired().HasMaxLength(255);
            entity.HasIndex(c => c.Email).IsUnique();
            entity.Property(c => c.FirstName).HasColumnName("FirstName")
                  .IsRequired().HasMaxLength(100);
            entity.Property(c => c.LastName).HasColumnName("LastName")
                  .IsRequired().HasMaxLength(100);
            entity.Property(c => c.Phone).HasColumnName("Phone")
                  .HasMaxLength(50);
            entity.Property(c => c.Address).HasColumnName("Address")
                  .HasMaxLength(255);
            entity.Property(c => c.City).HasColumnName("City")
                  .HasMaxLength(100);
            entity.Property(c => c.ZipCode).HasColumnName("ZipCode")
                  .HasMaxLength(20);
            entity.Property(c => c.Country).HasColumnName("Country")
                  .HasMaxLength(100);
            entity.Property(c => c.RoleId).HasColumnName("RoleID");
            entity.Property(c => c.Active).HasColumnName("IsActive");
            entity.Property(c => c.CreatedAt).HasColumnName("CreatedAt");
            entity.Property(c => c.UpdatedAt).HasColumnName("UpdatedAt");

            entity.HasOne(c => c.Role)
                  .WithMany(r => r.Customers)
                  .HasForeignKey(c => c.RoleId)
                  .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
