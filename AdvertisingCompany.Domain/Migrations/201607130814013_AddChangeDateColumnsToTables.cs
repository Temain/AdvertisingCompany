namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddChangeDateColumnsToTables : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Client", "CreatedAt", c => c.DateTime());
            AddColumn("dbo.Client", "UpdatedAt", c => c.DateTime());
            AddColumn("dbo.Client", "DeletedAt", c => c.DateTime());
            AddColumn("dbo.Address", "CreatedAt", c => c.DateTime());
            AddColumn("dbo.Address", "UpdatedAt", c => c.DateTime());
            AddColumn("dbo.Address", "DeletedAt", c => c.DateTime());
            AddColumn("dbo.Campaign", "CreatedAt", c => c.DateTime());
            AddColumn("dbo.Campaign", "UpdatedAt", c => c.DateTime());
            AddColumn("dbo.Campaign", "DeletedAt", c => c.DateTime());
            AddColumn("dbo.AddressReport", "CreatedAt", c => c.DateTime());
            AddColumn("dbo.AddressReport", "UpdatedAt", c => c.DateTime());
            AddColumn("dbo.AddressReport", "DeletedAt", c => c.DateTime());
            AlterColumn("serv.LogEntry", "Date", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("serv.LogEntry", "Date", c => c.String());
            DropColumn("dbo.AddressReport", "DeletedAt");
            DropColumn("dbo.AddressReport", "UpdatedAt");
            DropColumn("dbo.AddressReport", "CreatedAt");
            DropColumn("dbo.Campaign", "DeletedAt");
            DropColumn("dbo.Campaign", "UpdatedAt");
            DropColumn("dbo.Campaign", "CreatedAt");
            DropColumn("dbo.Address", "DeletedAt");
            DropColumn("dbo.Address", "UpdatedAt");
            DropColumn("dbo.Address", "CreatedAt");
            DropColumn("dbo.Client", "DeletedAt");
            DropColumn("dbo.Client", "UpdatedAt");
            DropColumn("dbo.Client", "CreatedAt");
        }
    }
}
