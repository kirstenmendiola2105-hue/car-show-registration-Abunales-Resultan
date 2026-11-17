namespace Application.Features.Registrations.GetRegistrations;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Features.Registrations.Common;
using Domain.Common;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationsQueryHandler(IAppDbContext dbContext)
    : IQueryHandler<GetRegistrationsQuery, Result<GetRegistrationsResponse>>
{
    public async Task<Result<GetRegistrationsResponse>> HandleAsync(
        GetRegistrationsQuery query,
        CancellationToken cancellationToken = default)
    {
        var registrations = dbContext.Registrations.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(query.ParticipantName))
        {
            var name = query.ParticipantName.Trim().ToLower();
            registrations = registrations.Where(r => r.ParticipantName.ToLower().Contains(name));
        }

        if (EnumParsing.TryParseName<RegistrationType>(query.Type, out var type))
        {
            registrations = registrations.Where(r => r.RegistrationType == type);
        }

        if (EnumParsing.TryParseName<RegistrationStatus>(query.Status, out var status))
        {
            registrations = registrations.Where(r => r.Status == status);
        }

        var totalCount = await registrations.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize);

        var rows = await registrations
            .OrderByDescending(r => r.RegistrationDate)
            .ThenByDescending(r => r.RegistrationNumber)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        var items = rows.Select(RegistrationResponse.From).ToList();

        return Result<GetRegistrationsResponse>.Success(
            new GetRegistrationsResponse(items, query.Page, query.PageSize, totalCount, totalPages));
    }
}
