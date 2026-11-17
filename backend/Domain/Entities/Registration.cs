namespace Domain.Entities;

using Domain.Common;
using Domain.Enums;

public sealed class Registration : BaseEntity
{
    public string RegistrationNumber { get; set; } = default!;
    public DateTime RegistrationDate { get; set; }
    public string ParticipantName { get; set; } = default!;
    public string ContactNumber { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Address { get; set; } = default!;
    public string CarMakeModel { get; set; } = default!;
    public string PlateNumber { get; set; } = default!;
    public RegistrationType RegistrationType { get; set; }
    public RegistrationStatus Status { get; set; } = RegistrationStatus.Pending;
    public decimal RegistrationFee { get; set; }
    public decimal AmountPaid { get; set; }

    /// <summary>Computed, not stored.</summary>
    public PaymentStatus PaymentStatus => ComputePaymentStatus(AmountPaid, RegistrationFee);

    public static PaymentStatus ComputePaymentStatus(decimal amountPaid, decimal fee)
    {
        if (amountPaid <= 0m)
        {
            return PaymentStatus.Unpaid;
        }

        return amountPaid >= fee ? PaymentStatus.Paid : PaymentStatus.Partial;
    }
}
