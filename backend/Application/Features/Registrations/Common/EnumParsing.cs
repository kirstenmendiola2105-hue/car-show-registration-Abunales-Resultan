namespace Application.Features.Registrations.Common;

internal static class EnumParsing
{
    /// <summary>Accepts names only (case-insensitive); numbers such as "1" are rejected.</summary>
    public static bool TryParseName<TEnum>(string? text, out TEnum value) where TEnum : struct, Enum
    {
        value = default;

        if (string.IsNullOrWhiteSpace(text))
        {
            return false;
        }

        var trimmed = text.Trim();

        if (int.TryParse(trimmed, out _))
        {
            return false;
        }

        return Enum.TryParse(trimmed, ignoreCase: true, out value) && Enum.IsDefined(value);
    }
}
