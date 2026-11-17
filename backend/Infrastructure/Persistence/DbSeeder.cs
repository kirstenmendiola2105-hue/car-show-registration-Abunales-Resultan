namespace Infrastructure.Persistence;

using Domain.Entities;
using Domain.Enums;

/// <summary>Inserts 25 sample registrations the first time the database is empty.</summary>
public static class DbSeeder
{
    public static void Seed(AppDbContext dbContext)
    {
        if (dbContext.Registrations.Any())
        {
            return;
        }

        dbContext.Registrations.AddRange(
            New(1, new DateTime(2026, 9, 1, 8, 0, 0, DateTimeKind.Utc), "Juan Dela Cruz", "09171234567", "juan.dela.cruz@example.com", "Rizal St., Sorsogon City", "Toyota Supra MK4", "ABC 1000", RegistrationType.Exhibitor, RegistrationStatus.Confirmed, 1500m),
            New(2, new DateTime(2026, 9, 3, 13, 13, 0, DateTimeKind.Utc), "Maria Santos", "09181243704", "maria.santos@example.com", "Magsaysay Ave., Bulan", "Honda Civic EK9", "BJF 1377", RegistrationType.Exhibitor, RegistrationStatus.Confirmed, 1500m),
            New(3, new DateTime(2026, 9, 5, 18, 26, 0, DateTimeKind.Utc), "Ana Reyes", "09191252841", "ana.reyes@example.com", "Burgos St., Gubat", "Nissan Skyline R34", "CSJ 1754", RegistrationType.Exhibitor, RegistrationStatus.Confirmed, 0m),
            New(4, new DateTime(2026, 9, 7, 12, 39, 0, DateTimeKind.Utc), "Pedro Villanueva", "09201261978", "pedro.villanueva@example.com", "Del Rosario St., Irosin", "Mazda RX-7 FD", "DZM 2131", RegistrationType.Exhibitor, RegistrationStatus.Confirmed, 1500m),
            New(5, new DateTime(2026, 9, 9, 17, 52, 0, DateTimeKind.Utc), "Carla Mendoza", "09211271115", "carla.mendoza@example.com", "Quezon Ave., Matnog", "Mitsubishi Lancer Evo IX", "EGR 2508", RegistrationType.Competitor, RegistrationStatus.Confirmed, 2500m),
            New(6, new DateTime(2026, 9, 11, 11, 5, 0, DateTimeKind.Utc), "Jose Ramirez", "09221280252", "jose.ramirez@example.com", "Roxas Blvd., Sorsogon City", "Subaru WRX STI", "FPU 2885", RegistrationType.Competitor, RegistrationStatus.Confirmed, 1000m),
            New(7, new DateTime(2026, 9, 13, 16, 18, 0, DateTimeKind.Utc), "Liza Fernandez", "09231289389", "liza.fernandez@example.com", "Pili Dr., Castilla", "Toyota AE86 Trueno", "GXX 3262", RegistrationType.VIP, RegistrationStatus.Confirmed, 5000m),
            New(8, new DateTime(2026, 9, 15, 10, 31, 0, DateTimeKind.Utc), "Mark Bautista", "09241298526", "mark.bautista@example.com", "Bonifacio St., Barcelona", "Honda S2000", "HEA 3639", RegistrationType.VIP, RegistrationStatus.Confirmed, 5000m),
            New(9, new DateTime(2026, 9, 17, 15, 44, 0, DateTimeKind.Utc), "Ana Marie Gonzales", "09171307663", "ana.marie.gonzales@example.com", "Rizal St., Sorsogon City", "Nissan 370Z", "JMD 4016", RegistrationType.VIP, RegistrationStatus.Confirmed, 1500m),
            New(10, new DateTime(2026, 9, 19, 9, 57, 0, DateTimeKind.Utc), "Ramon Dizon", "09181316800", "ramon.dizon@example.com", "Magsaysay Ave., Bulan", "Ford Mustang GT", "KVG 4393", RegistrationType.Exhibitor, RegistrationStatus.Confirmed, 0m),
            New(11, new DateTime(2026, 9, 21, 14, 10, 0, DateTimeKind.Utc), "Grace Aquino", "09191325937", "grace.aquino@example.com", "Burgos St., Gubat", "Chevrolet Camaro SS", "LCK 4770", RegistrationType.Exhibitor, RegistrationStatus.CheckedIn, 1500m),
            New(12, new DateTime(2026, 9, 23, 8, 23, 0, DateTimeKind.Utc), "Paolo Navarro", "09201335074", "paolo.navarro@example.com", "Del Rosario St., Irosin", "Toyota GR86", "MKN 5147", RegistrationType.Exhibitor, RegistrationStatus.CheckedIn, 1500m),
            New(13, new DateTime(2026, 9, 25, 13, 36, 0, DateTimeKind.Utc), "Katrina Lopez", "09211344211", "katrina.lopez@example.com", "Quezon Ave., Matnog", "Mazda MX-5 NA", "NTS 5524", RegistrationType.Competitor, RegistrationStatus.CheckedIn, 2500m),
            New(14, new DateTime(2026, 9, 27, 18, 49, 0, DateTimeKind.Utc), "Dennis Castillo", "09221353348", "dennis.castillo@example.com", "Roxas Blvd., Sorsogon City", "Honda NSX NA1", "PAV 5901", RegistrationType.VIP, RegistrationStatus.CheckedIn, 5000m),
            New(15, new DateTime(2026, 9, 29, 12, 2, 0, DateTimeKind.Utc), "Rhea Morales", "09231362485", "rhea.morales@example.com", "Pili Dr., Castilla", "Nissan GT-R R35", "RHY 6278", RegistrationType.VIP, RegistrationStatus.CheckedIn, 5000m),
            New(16, new DateTime(2026, 10, 1, 17, 15, 0, DateTimeKind.Utc), "Joel Garcia", "09241371622", "joel.garcia@example.com", "Bonifacio St., Barcelona", "Suzuki Swift Sport", "SRB 6655", RegistrationType.VIP, RegistrationStatus.CheckedIn, 5000m),
            New(17, new DateTime(2026, 10, 3, 11, 28, 0, DateTimeKind.Utc), "Bianca Torres", "09171380759", "bianca.torres@example.com", "Rizal St., Sorsogon City", "Hyundai Veloster N", "TYE 7032", RegistrationType.Exhibitor, RegistrationStatus.Pending, 0m),
            New(18, new DateTime(2026, 10, 5, 16, 41, 0, DateTimeKind.Utc), "Nathan Ocampo", "09181389896", "nathan.ocampo@example.com", "Magsaysay Ave., Bulan", "BMW M3 E46", "UFH 7409", RegistrationType.Exhibitor, RegistrationStatus.Pending, 500m),
            New(19, new DateTime(2026, 10, 7, 10, 54, 0, DateTimeKind.Utc), "Sheila Domingo", "09191399033", "sheila.domingo@example.com", "Burgos St., Gubat", "Porsche 911 Carrera", "VNL 7786", RegistrationType.Exhibitor, RegistrationStatus.Pending, 0m),
            New(20, new DateTime(2026, 10, 9, 15, 7, 0, DateTimeKind.Utc), "Alvin Cruz", "09201408170", "alvin.cruz@example.com", "Del Rosario St., Irosin", "Volkswagen Golf GTI", "WWP 8163", RegistrationType.Exhibitor, RegistrationStatus.Pending, 1500m),
            New(21, new DateTime(2026, 10, 11, 9, 20, 0, DateTimeKind.Utc), "Faith Pascual", "09211417307", "faith.pascual@example.com", "Quezon Ave., Matnog", "Mini Cooper S", "XDT 8540", RegistrationType.Competitor, RegistrationStatus.Pending, 0m),
            New(22, new DateTime(2026, 10, 13, 14, 33, 0, DateTimeKind.Utc), "Gilbert Soriano", "09221426444", "gilbert.soriano@example.com", "Roxas Blvd., Sorsogon City", "Lexus IS300", "YLW 8917", RegistrationType.VIP, RegistrationStatus.Pending, 0m),
            New(23, new DateTime(2026, 10, 15, 8, 46, 0, DateTimeKind.Utc), "Hannah Valdez", "09231435581", "hannah.valdez@example.com", "Pili Dr., Castilla", "Toyota Vios Sport", "ZUZ 9294", RegistrationType.Exhibitor, RegistrationStatus.Cancelled, 1500m),
            New(24, new DateTime(2026, 10, 17, 13, 59, 0, DateTimeKind.Utc), "Ian Salazar", "09241444718", "ian.salazar@example.com", "Bonifacio St., Barcelona", "Mitsubishi Starion", "ABC 9671", RegistrationType.Competitor, RegistrationStatus.Cancelled, 500m),
            New(25, new DateTime(2026, 10, 19, 18, 12, 0, DateTimeKind.Utc), "Jasmine Rivera", "09171453855", "jasmine.rivera@example.com", "Rizal St., Sorsogon City", "Datsun 240Z", "BJF 1048", RegistrationType.VIP, RegistrationStatus.Cancelled, 0m)        );

        dbContext.SaveChanges();
    }

    private static Registration New(
        int number,
        DateTime date,
        string name,
        string contact,
        string email,
        string address,
        string car,
        string plate,
        RegistrationType type,
        RegistrationStatus status,
        decimal paid) => new()
    {
        Id = Guid.NewGuid(),
        RegistrationNumber = $"CS27-{number:D4}",
        RegistrationDate = date,
        ParticipantName = name,
        ContactNumber = contact,
        Email = email,
        Address = address,
        CarMakeModel = car,
        PlateNumber = plate,
        RegistrationType = type,
        Status = status,
        RegistrationFee = Domain.Common.RegistrationFees.For(type),
        AmountPaid = paid
    };
}
