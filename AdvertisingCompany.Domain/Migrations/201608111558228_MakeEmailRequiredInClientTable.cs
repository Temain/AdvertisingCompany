namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MakeEmailRequiredInClientTable : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Client", "Email", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Client", "Email", c => c.String());
        }
    }
}
