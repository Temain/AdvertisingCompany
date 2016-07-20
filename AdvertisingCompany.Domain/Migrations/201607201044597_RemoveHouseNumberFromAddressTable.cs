namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveHouseNumberFromAddressTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Address", "Building", c => c.String(nullable: false, maxLength: 10));
            DropColumn("dbo.Address", "HouseNumber");
            DropColumn("dbo.Address", "BuildingNumber");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Address", "BuildingNumber", c => c.String(maxLength: 10));
            AddColumn("dbo.Address", "HouseNumber", c => c.String(nullable: false, maxLength: 10));
            DropColumn("dbo.Address", "Building");
        }
    }
}
