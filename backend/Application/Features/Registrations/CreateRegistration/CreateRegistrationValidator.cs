namespace Application.Features.Registrations.CreateRegistration;

using System.Globalization;
using Domain.Common;
using FluentValidation;

public sealed class CreateRegistrationValidator : AbstractValidator<CreateRegistrationCommand>
{
    public CreateRegistrationValidator()
    {
        RuleFor(x => x.ParticipantName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .MaximumLength(150);

        RuleFor(x => x.ContactNumber)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .Matches(@"^09\d{9}$")
            .WithMessage("'Contact Number' must be a valid PH mobile number in the format 09XXXXXXXXX (11 digits).");

        RuleFor(x => x.Email)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .MaximumLength(200)
            .EmailAddress();

        RuleFor(x => x.Address)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .MaximumLength(300);

        RuleFor(x => x.CarMakeModel)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.PlateNumber)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .MaximumLength(15);

        RuleFor(x => x.RegistrationType)
            .Cascade(CascadeMode.Stop)
            .NotNull()
            .WithMessage("'Registration Type' is required and must be Exhibitor, Competitor or VIP.")
            .IsInEnum()
            .WithMessage("'Registration Type' must be Exhibitor, Competitor or VIP.");

        RuleFor(x => x.AmountPaid)
            .Cascade(CascadeMode.Stop)
            .GreaterThanOrEqualTo(0m)
            .WithMessage("'Amount Paid' must be 0 or more.")
            .Must(amount => decimal.Round(amount, 2) == amount)
            .WithMessage("'Amount Paid' can have at most 2 decimal places.")
            .Must((command, amount) =>
                command.RegistrationType is null
                || !Enum.IsDefined(command.RegistrationType.Value)
                || amount <= RegistrationFees.For(command.RegistrationType.Value))
            .WithMessage(command =>
                $"'Amount Paid' cannot be more than the fee ({RegistrationFees.For(command.RegistrationType!.Value).ToString("N0", CultureInfo.InvariantCulture)}).");
    }
}
