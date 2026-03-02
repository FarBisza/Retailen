using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Retailen.Domain.Entities.Cart;

namespace Retailen.Infrastructure.Persistence.Configurations
{
    public class CartConfiguration : IEntityTypeConfiguration<Cart>
    {
        public void Configure(EntityTypeBuilder<Cart> entity)
        {
            entity.ToTable("Cart");
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Id).HasColumnName("CartID");
            entity.Property(c => c.CustomerId).HasColumnName("CustomerID");
            entity.Property(c => c.SessionId).HasColumnName("SessionID")
                  .HasMaxLength(255);
            entity.Property(c => c.Active).HasColumnName("IsActive");

            entity.HasMany(c => c.Items)
                  .WithOne()
                  .HasForeignKey(i => i.CartId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.Metadata.FindNavigation(nameof(Cart.Items))?
                  .SetPropertyAccessMode(PropertyAccessMode.Field);
        }
    }

    public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
    {
        public void Configure(EntityTypeBuilder<CartItem> entity)
        {
            entity.ToTable("CartItem");
            entity.HasKey(i => i.Id);
            entity.Property(i => i.Id).HasColumnName("CartItemID");
            entity.Property(i => i.CartId).HasColumnName("CartID");
            entity.Property(i => i.ProductId).HasColumnName("ProductID");
            entity.Property(i => i.Quantity).HasColumnName("Quantity");

            entity.HasOne(i => i.Product)
                  .WithMany()
                  .HasForeignKey(i => i.ProductId)
                  .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
