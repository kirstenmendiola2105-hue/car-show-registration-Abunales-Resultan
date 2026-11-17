namespace Application.Features.Registrations.CreateRegistration;

using Application.Abstractions.Messaging;
using Application.Features.Registrations.Common;
using Domain.Common;
using Domain.Enums;

/// <summary>
/// Request body. The client never sends the number, date, fee or status;
/// extra JSON fields with those names are simply ignored.
/// The response is the shared <see cref="RegistrationResponse"/>.
/// </summary>
public sealed record CreateRegistrationCommand(
    string ParticipantName,
    string ContactNumber,
    string Email,
    string Address,
    string CarMakeModel,
    string PlateNumber,
    RegistrationType? RegistrationType,
    decimal AmountPaid) : ICommand<Result<RegistrationResponse>>;
