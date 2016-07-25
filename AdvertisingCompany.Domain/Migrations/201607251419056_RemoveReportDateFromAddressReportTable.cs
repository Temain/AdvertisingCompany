namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveReportDateFromAddressReportTable : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.AddressReport", "ReportDate");
        }
        
        public override void Down()
        {
            AddColumn("dbo.AddressReport", "ReportDate", c => c.DateTime(nullable: false));
        }
    }
}
