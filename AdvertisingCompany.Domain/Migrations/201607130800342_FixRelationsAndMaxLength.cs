namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FixRelationsAndMaxLength : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Campaign", "PaymentStatusId", c => c.Int(nullable: false));
            AlterColumn("dbo.Client", "CompanyName", c => c.String(nullable: false, maxLength: 1000));
            AlterColumn("dbo.Client", "PhoneNumber", c => c.String(nullable: false, maxLength: 100));
            AlterColumn("dbo.Address", "HouseNumber", c => c.String(nullable: false, maxLength: 10));
            AlterColumn("dbo.Address", "BuildingNumber", c => c.String(maxLength: 10));
            CreateIndex("dbo.Campaign", "PaymentStatusId");
            AddForeignKey("dbo.Campaign", "PaymentStatusId", "dict.PaymentStatus", "PaymentStatusId");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Campaign", "PaymentStatusId", "dict.PaymentStatus");
            DropIndex("dbo.Campaign", new[] { "PaymentStatusId" });
            AlterColumn("dbo.Address", "BuildingNumber", c => c.String());
            AlterColumn("dbo.Address", "HouseNumber", c => c.String(nullable: false));
            AlterColumn("dbo.Client", "PhoneNumber", c => c.String(nullable: false));
            AlterColumn("dbo.Client", "CompanyName", c => c.String(nullable: false));
            DropColumn("dbo.Campaign", "PaymentStatusId");
        }
    }
}
