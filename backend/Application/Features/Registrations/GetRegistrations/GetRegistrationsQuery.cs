namespace Application.Features.Registrations.GetRegistrations;

using Application.Abstractions.Messaging;
using Application.Features.Registrations.Common;
using Domain.Common;

/// <summary>Filters work alone or combined. Type and Status are text so bad values give a clean 400.</summary>
public sealed record GetRegistrationsQuery(
    string? ParticipantName = null,
    string? Type = null,
    string? Status = null,
    int Page = 1,
    int PageSize = 10) : IQuery<Result<GetRegistrationsResponse>>;

public sealed record GetRegistrationsResponse(
    IReadOnlyList<RegistrationResponse> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages);
