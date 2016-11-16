namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PersonLastNameNotRequired : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Person", "LastName", c => c.String(maxLength: 500));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Person", "LastName", c => c.String(nullable: false, maxLength: 500));
        }
    }
}
