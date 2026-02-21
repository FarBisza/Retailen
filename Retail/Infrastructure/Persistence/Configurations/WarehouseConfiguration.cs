using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Retailen.Domain.Entities.Logistics;

namespace Retailen.Infrastructure.Persistence.Configurations
{
    public class WarehouseConfiguration : IEntityTypeConfiguration<Warehouse>
    {
        public void Configure(EntityTypeBuilder<Warehouse> entity)
        {
            entity.ToTable("Warehouse");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("WarehouseID");
            entity.Property(e => e.Name).HasColumnName("Name")
                  .IsRequired().HasMaxLength(200);
            entity.Property(e => e.Active).HasColumnName("IsActive");
            entity.Property(e => e.Latitude).HasPrecision(9, 6);
            entity.Property(e => e.Longitude).HasPrecision(9, 6);

            entity.HasData(
                new { Id = 1,  Name = "Memphis TN",        Latitude = 35.117400m,  Longitude = -89.971100m,  Active = true },
                new { Id = 2,  Name = "Chicago IL",        Latitude = 41.836900m,  Longitude = -87.684700m,  Active = true },
                new { Id = 3,  Name = "Houston TX",        Latitude = 29.760400m,  Longitude = -95.369800m,  Active = true },
                new { Id = 4,  Name = "Los Angeles CA",    Latitude = 34.050000m,  Longitude = -118.250000m, Active = true },
                new { Id = 5,  Name = "New Orleans LA",    Latitude = 29.950000m,  Longitude = -90.066700m,  Active = true },
                new { Id = 6,  Name = "New York/New Jersey", Latitude = 40.634000m, Longitude = -73.783400m, Active = true },
                new { Id = 7,  Name = "Philadelphia PA",   Latitude = 39.950000m,  Longitude = -75.166700m,  Active = true },
                new { Id = 8,  Name = "Mobile AL",         Latitude = 30.694400m,  Longitude = -88.043100m,  Active = true },
                new { Id = 9,  Name = "Charleston SC",     Latitude = 32.783300m,  Longitude = -79.933300m,  Active = true },
                new { Id = 10, Name = "Savannah GA",       Latitude = 32.016700m,  Longitude = -81.116700m,  Active = true }
            );
        }
    }
}
