namespace Application.Features.Registrations.CreateRegistration;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Features.Registrations.Common;
using Domain.Common;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class CreateRegistrationCommandHandler(IAppDbContext dbContext)
    : ICommandHandler<CreateRegistrationCommand, Result<RegistrationResponse>>
{
    public async Task<Result<RegistrationResponse>> HandleAsync(
        CreateRegistrationCommand command,
        CancellationToken cancellationToken = default)
    {
        var plate = command.PlateNumber.Trim();
        var plateUpper = plate.ToUpper();

        var plateTaken = await dbContext.Registrations
            .AnyAsync(r => r.PlateNumber.ToUpper() == plateUpper, cancellationToken);

        if (plateTaken)
        {
            return Result<RegistrationResponse>.Failure(Error.Conflict(
                "Registration.Conflict",
                $"A registration with plate number '{plate}' already exists."));
        }

        var type = command.RegistrationType!.Value;

        var registration = new Registration
        {
            Id = Guid.NewGuid(),
            RegistrationNumber = await NextRegistrationNumberAsync(cancellationToken),
            RegistrationDate = DateTime.UtcNow,
            ParticipantName = command.ParticipantName.Trim(),
            ContactNumber = command.ContactNumber.Trim(),
            Email = command.Email.Trim(),
            Address = command.Address.Trim(),
            CarMakeModel = command.CarMakeModel.Trim(),
            PlateNumber = plate,
            RegistrationType = type,
            Status = RegistrationStatus.Pending,
            RegistrationFee = RegistrationFees.For(type),
            AmountPaid = command.AmountPaid
        };

        dbContext.Registrations.Add(registration);

        try
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException)
        {
            // Unique index on PlateNumber / RegistrationNumber was hit by a parallel request.
            return Result<RegistrationResponse>.Failure(Error.Conflict(
                "Registration.Conflict",
                $"The registration could not be saved because plate number '{plate}' or the registration number is already in use. Please try again."));
        }

        return Result<RegistrationResponse>.Success(RegistrationResponse.From(registration));
    }

    private async Task<string> NextRegistrationNumberAsync(CancellationToken cancellationToken)
    {
        // Numbers are zero-padded, so the longest / highest string is the latest one.
        var last = await dbContext.Registrations
            .OrderByDescending(r => r.RegistrationNumber.Length)
            .ThenByDescending(r => r.RegistrationNumber)
            .Select(r => r.RegistrationNumber)
            .FirstOrDefaultAsync(cancellationToken);

        var next = 1;

        if (last is not null
            && last.StartsWith(RegistrationFees.NumberPrefix, StringComparison.Ordinal)
            && int.TryParse(last.AsSpan(RegistrationFees.NumberPrefix.Length), out var current))
        {
            next = current + 1;
        }

        return $"{RegistrationFees.NumberPrefix}{next:D4}";
    }
}
