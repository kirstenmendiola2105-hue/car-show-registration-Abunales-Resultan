namespace Application.Features.Registrations.GetRegistrationById;

using Application.Abstractions.Messaging;
using Application.Features.Registrations.Common;
using Domain.Common;

/// <summary>The response is the shared <see cref="RegistrationResponse"/>.</summary>
public sealed record GetRegistrationByIdQuery(Guid Id) : IQuery<Result<RegistrationResponse>>;
