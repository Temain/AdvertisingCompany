using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using AdvertisingCompany.Domain.Models;
using Microsoft.AspNet.Identity.EntityFramework;

namespace AdvertisingCompany.Domain.Context
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<ActivityType> ActivityTypes { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<AddressReport> AddressReports { get; set; }
        public DbSet<Campaign> Campaigns { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<ClientStatus> ClientStatuses { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<LocationType> LocationTypes { get; set; }
        public DbSet<LocationLevel> LocationLevels { get; set; }
        public DbSet<LogEntry> LogEntries { get; set; }
        public DbSet<Microdistrict> Microdistricts { get; set; }
        public DbSet<PaymentOrder> PaymentOrders { get; set; }
        public DbSet<PaymentStatus> PaymentStatuses { get; set; }
        public DbSet<Person> Persons { get; set; }
        public DbSet<PlacementFormat> PlacementFormats { get; set; }


        public ApplicationDbContext()
            : base("AdvertisingCompanyConnection", throwIfV1Schema: false)
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

            // Отключаем каскадное удаление данных в связанных таблицах
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
            modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();

            // Запрещаем создание имен таблиц в множественном числе в т.ч. при связи многие к многим
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            modelBuilder.Entity<Campaign>()
                .HasMany(p => p.Microdistricts)
                .WithMany(s => s.Campaigns)
                .Map(c =>
                {
                    c.MapLeftKey("CampaignId");
                    c.MapRightKey("MicrodistrictId");
                    c.ToTable("CampaignMicrodistricts");
                });

            base.OnModelCreating(modelBuilder);
        }
    }
}
