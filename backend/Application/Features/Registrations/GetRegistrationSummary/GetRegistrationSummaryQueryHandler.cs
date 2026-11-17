namespace Application.Features.Registrations.GetRegistrationSummary;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Features.Registrations.Common;
using Domain.Common;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationSummaryQueryHandler(IAppDbContext dbContext)
    : IQueryHandler<GetRegistrationSummaryQuery, Result<GetRegistrationSummaryResponse>>
{
    public async Task<Result<GetRegistrationSummaryResponse>> HandleAsync(
        GetRegistrationSummaryQuery query,
        CancellationToken cancellationToken = default)
    {
        var counts = await dbContext.Registrations
            .AsNoTracking()
            .GroupBy(r => r.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        int CountOf(RegistrationStatus status) => counts.FirstOrDefault(c => c.Status == status)?.Count ?? 0;

        // SQLite cannot SUM decimal columns in SQL, so the (small) money columns are summed here.
        // Cancelled registrations are excluded from every money total.
        var money = await dbContext.Registrations
            .AsNoTracking()
            .Where(r => r.Status != RegistrationStatus.Cancelled)
            .Select(r => new { r.RegistrationFee, r.AmountPaid })
            .ToListAsync(cancellationToken);

        var totalFees = money.Sum(m => m.RegistrationFee);
        var totalPayments = money.Sum(m => m.AmountPaid);

        var response = new GetRegistrationSummaryResponse(
            TotalRegistrations: counts.Sum(c => c.Count),
            Confirmed: CountOf(RegistrationStatus.Confirmed),
            CheckedIn: CountOf(RegistrationStatus.CheckedIn),
            Pending: CountOf(RegistrationStatus.Pending),
            Cancelled: CountOf(RegistrationStatus.Cancelled),
            TotalFees: RegistrationResponse.Money(totalFees),
            TotalPayments: RegistrationResponse.Money(totalPayments),
            UncollectedPayments: RegistrationResponse.Money(totalFees - totalPayments));

        return Result<GetRegistrationSummaryResponse>.Success(response);
    }
}
