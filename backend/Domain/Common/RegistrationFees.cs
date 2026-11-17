namespace Domain.Common;

using Domain.Enums;

/// <summary>Business rule: the fee is decided by the server from the registration type.</summary>
public static class RegistrationFees
{
    public const string NumberPrefix = "CS27-";

    public static decimal For(RegistrationType type) => type switch
    {
        RegistrationType.Exhibitor => 1500.00m,
        RegistrationType.Competitor => 2500.00m,
        RegistrationType.VIP => 5000.00m,
        _ => throw new ArgumentOutOfRangeException(nameof(type), type, "Unknown registration type.")
    };
}
