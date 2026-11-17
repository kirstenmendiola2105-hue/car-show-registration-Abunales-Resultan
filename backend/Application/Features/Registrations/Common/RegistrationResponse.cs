namespace Application.Features.Registrations.Common;

using System.Globalization;
using Domain.Entities;
using Domain.Enums;

/// <summary>The JSON shape of one registration (shared API contract).</summary>
public sealed record RegistrationResponse(
    Guid Id,
    string RegistrationNumber,
    DateTime RegistrationDate,
    string ParticipantName,
    string ContactNumber,
    string Email,
    string Address,
    string CarMakeModel,
    string PlateNumber,
    RegistrationType RegistrationType,
    RegistrationStatus Status,
    decimal RegistrationFee,
    decimal AmountPaid,
    PaymentStatus PaymentStatus)
{
    public static RegistrationResponse From(Registration r) => new(
        r.Id,
        r.RegistrationNumber,
        DateTime.SpecifyKind(r.RegistrationDate, DateTimeKind.Utc),
        r.ParticipantName,
        r.ContactNumber,
        r.Email,
        r.Address,
        r.CarMakeModel,
        r.PlateNumber,
        r.RegistrationType,
        r.Status,
        Money(r.RegistrationFee),
        Money(r.AmountPaid),
        r.PaymentStatus);

    /// <summary>Always two decimals, so JSON shows 2500.00 like the contract.</summary>
    public static decimal Money(decimal value) =>
        decimal.Parse(value.ToString("F2", CultureInfo.InvariantCulture), CultureInfo.InvariantCulture);
}
