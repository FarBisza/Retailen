using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Retailen.Domain.Entities;

namespace Retailen.Infrastructure.Persistence.Configurations
{
    public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
    {
        public void Configure(EntityTypeBuilder<RefreshToken> entity)
        {
            entity.ToTable("RefreshToken");
            entity.HasKey(rt => rt.Id);
            entity.Property(rt => rt.Token).IsRequired().HasMaxLength(500);
            entity.Property(rt => rt.CreatedAt).HasColumnName("CreatedAt");

            entity.HasOne(rt => rt.Customer)
                  .WithMany(c => c.RefreshTokens)
                  .HasForeignKey(rt => rt.CustomerId)
                  .HasPrincipalKey(c => c.Id);

            entity.Property(rt => rt.CustomerId).HasColumnName("CustomerID");
        }
    }
}
