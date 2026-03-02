using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Retailen.Domain.Entities;

namespace Retailen.Infrastructure.Persistence.Configurations
{
    public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
    {
        public void Configure(EntityTypeBuilder<Invoice> entity)
        {
            entity.ToTable("Invoice");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("InvoiceID");
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.InvoiceStatusId).HasColumnName("InvoiceStatusID");
            entity.Property(e => e.Amount).HasColumnName("Amount")
                  .HasColumnType("decimal(18,2)");
            entity.Property(e => e.IssuedDate).HasColumnName("IssuedDate");

            entity.HasOne(e => e.Order)
                  .WithMany(o => o.Invoices)
                  .HasForeignKey(e => e.OrderId);
        }
    }

    public class InvoiceStatusConfiguration : IEntityTypeConfiguration<InvoiceStatus>
    {
        public void Configure(EntityTypeBuilder<InvoiceStatus> entity)
        {
            entity.ToTable("InvoiceStatus");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("InvoiceStatusID");
            entity.Property(e => e.Name).HasColumnName("Name")
                  .IsRequired().HasMaxLength(100);

            entity.HasData(
                new { Id = 1, Name = "Issued" },
                new { Id = 2, Name = "Paid" },
                new { Id = 3, Name = "Cancelled" }
            );
        }
    }

    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> entity)
        {
            entity.ToTable("Payment");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("PaymentID");
            entity.Property(e => e.InvoiceId).HasColumnName("InvoiceID");
            entity.Property(e => e.PaymentTypeId).HasColumnName("PaymentTypeID");
            entity.Property(e => e.Amount).HasColumnName("Amount")
                  .HasColumnType("decimal(18,2)");
            entity.Property(e => e.PaymentDate).HasColumnName("PaymentDate");
            entity.Property(e => e.OrderId).HasColumnName("OrderID");

            entity.HasOne(e => e.Invoice)
                  .WithMany(i => i.Payments)
                  .HasForeignKey(e => e.InvoiceId);

            entity.HasOne(e => e.Order)
                  .WithMany()
                  .HasForeignKey(e => e.OrderId);
        }
    }

    public class PaymentTypeConfiguration : IEntityTypeConfiguration<PaymentType>
    {
        public void Configure(EntityTypeBuilder<PaymentType> entity)
        {
            entity.ToTable("PaymentType");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("PaymentTypeID");
            entity.Property(e => e.Name).HasColumnName("Name")
                  .IsRequired().HasMaxLength(50);

            entity.HasData(
                new { Id = 1, Name = "Credit Card" },
                new { Id = 2, Name = "Bank Transfer" },
                new { Id = 3, Name = "Apple Pay" },
                new { Id = 4, Name = "PayPal" }
            );
        }
    }
}
