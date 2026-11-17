namespace Application.Features.Registrations.GetRegistrations;

using Application.Features.Registrations.Common;
using Domain.Enums;
using FluentValidation;

public sealed class GetRegistrationsValidator : AbstractValidator<GetRegistrationsQuery>
{
    public GetRegistrationsValidator()
    {
        RuleFor(x => x.ParticipantName)
            .MaximumLength(150);

        RuleFor(x => x.Type)
            .Must(value => EnumParsing.TryParseName<RegistrationType>(value, out _))
            .When(x => !string.IsNullOrWhiteSpace(x.Type))
            .WithMessage("'Type' must be one of: Exhibitor, Competitor, VIP.");

        RuleFor(x => x.Status)
            .Must(value => EnumParsing.TryParseName<RegistrationStatus>(value, out _))
            .When(x => !string.IsNullOrWhiteSpace(x.Status))
            .WithMessage("'Status' must be one of: Pending, Confirmed, CheckedIn, Cancelled.");

        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1)
            .WithMessage("'Page' must be 1 or more.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 50)
            .WithMessage("'Page Size' must be between 1 and 50.");
    }
}
