namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MakeCreatedAtRequired : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dict.ActivityCategory", "CreatedAt", c => c.DateTime(nullable: false));
            AlterColumn("dict.ActivityType", "CreatedAt", c => c.DateTime(nullable: false));
            AlterColumn("dbo.Client", "CreatedAt", c => c.DateTime(nullable: false));
            AlterColumn("dbo.Person", "CreatedAt", c => c.DateTime(nullable: false));
            AlterColumn("dbo.Campaign", "CreatedAt", c => c.DateTime(nullable: false));
            AlterColumn("dbo.Address", "CreatedAt", c => c.DateTime(nullable: false));
            AlterColumn("dbo.AddressReport", "CreatedAt", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.AddressReport", "CreatedAt", c => c.DateTime());
            AlterColumn("dbo.Address", "CreatedAt", c => c.DateTime());
            AlterColumn("dbo.Campaign", "CreatedAt", c => c.DateTime());
            AlterColumn("dbo.Person", "CreatedAt", c => c.DateTime());
            AlterColumn("dbo.Client", "CreatedAt", c => c.DateTime());
            AlterColumn("dict.ActivityType", "CreatedAt", c => c.DateTime());
            AlterColumn("dict.ActivityCategory", "CreatedAt", c => c.DateTime());
        }
    }
}
