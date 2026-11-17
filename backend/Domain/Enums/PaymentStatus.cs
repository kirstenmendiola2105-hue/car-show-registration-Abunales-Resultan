namespace Domain.Enums;

/// <summary>Computed from AmountPaid and RegistrationFee. Never stored in the database.</summary>
public enum PaymentStatus
{
    Unpaid = 0,
    Partial = 1,
    Paid = 2
}
