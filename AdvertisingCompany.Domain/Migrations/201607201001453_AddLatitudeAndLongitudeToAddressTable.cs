namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLatitudeAndLongitudeToAddressTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Address", "Latitude", c => c.Double(nullable: false));
            AddColumn("dbo.Address", "Longitude", c => c.Double(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Address", "Longitude");
            DropColumn("dbo.Address", "Latitude");
        }
    }
}
