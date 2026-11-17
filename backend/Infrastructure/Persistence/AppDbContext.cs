namespace Infrastructure.Persistence;

using Application.Abstractions.Data;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Registration> Registrations => Set<Registration>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Registration>(entity =>
        {
            entity.ToTable("Registrations");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.Property(e => e.RegistrationNumber).IsRequired().HasMaxLength(20);
            entity.HasIndex(e => e.RegistrationNumber).IsUnique();

            // Stored as UTC; SQLite returns Kind=Unspecified, so mark it as UTC when reading.
            entity.Property(e => e.RegistrationDate)
                .IsRequired()
                .HasConversion(
                    value => value.Kind == DateTimeKind.Utc ? value : value.ToUniversalTime(),
                    value => DateTime.SpecifyKind(value, DateTimeKind.Utc));

            entity.Property(e => e.ParticipantName).IsRequired().HasMaxLength(150);
            entity.Property(e => e.ContactNumber).IsRequired().HasMaxLength(11);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Address).IsRequired().HasMaxLength(300);
            entity.Property(e => e.CarMakeModel).IsRequired().HasMaxLength(100);

            entity.Property(e => e.PlateNumber).IsRequired().HasMaxLength(15);
            entity.HasIndex(e => e.PlateNumber).IsUnique();

            entity.Property(e => e.RegistrationType).IsRequired().HasConversion<string>().HasMaxLength(20);
            entity.Property(e => e.Status).IsRequired().HasConversion<string>().HasMaxLength(20);

            entity.Property(e => e.RegistrationFee).HasPrecision(18, 2);
            entity.Property(e => e.AmountPaid).HasPrecision(18, 2);

            // Computed from AmountPaid and RegistrationFee, never stored.
            entity.Ignore(e => e.PaymentStatus);
        });
    }
}
