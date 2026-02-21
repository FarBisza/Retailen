using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Retailen.Domain.Entities;

namespace Retailen.Infrastructure.Persistence.Configurations
{
    public class RoleConfiguration : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> entity)
        {
            entity.ToTable("Role");
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Id).HasColumnName("RoleID");
            entity.Property(r => r.Name).HasColumnName("RoleName")
                  .IsRequired().HasMaxLength(50);

            entity.HasData(
                new Role { Id = 1, Name = "Admin" },
                new Role { Id = 2, Name = "Customer" },
                new Role { Id = 3, Name = "Employee" },
                new Role { Id = 4, Name = "Supplier" }
            );
        }
    }
}
