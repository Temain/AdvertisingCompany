namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLocationTables : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "kladr.Location",
                c => new
                    {
                        LocationId = c.Int(nullable: false, identity: true),
                        LocationName = c.String(),
                        LocationLevelId = c.Int(nullable: false),
                        LocationTypeId = c.Int(nullable: false),
                        Code = c.String(),
                        Zip = c.String(),
                        Okato = c.String(),
                        ParentId = c.Int(),
                    })
                .PrimaryKey(t => t.LocationId)
                .ForeignKey("kladr.LocationLevel", t => t.LocationLevelId)
                .ForeignKey("kladr.LocationType", t => t.LocationTypeId)
                .ForeignKey("kladr.Location", t => t.ParentId)
                .Index(t => t.LocationLevelId)
                .Index(t => t.LocationTypeId)
                .Index(t => t.ParentId);
            
            CreateTable(
                "kladr.LocationLevel",
                c => new
                    {
                        LocationLevelId = c.Int(nullable: false, identity: true),
                        LocationLevelName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.LocationLevelId);
            
            CreateTable(
                "kladr.LocationType",
                c => new
                    {
                        LocationTypeId = c.Int(nullable: false, identity: true),
                        LocationTypeName = c.String(nullable: false),
                        LocationTypeShortName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.LocationTypeId);
            
            AddColumn("dbo.Address", "RegionId", c => c.Int(nullable: false));
            AddColumn("dbo.Address", "DistrictId", c => c.Int());
            AddColumn("dbo.Address", "CityId", c => c.Int(nullable: false));
            AddColumn("dbo.Address", "StreetId", c => c.Int(nullable: false));
            AddColumn("dbo.Address", "BuildingId", c => c.Int(nullable: false));
            CreateIndex("dbo.Address", "RegionId");
            CreateIndex("dbo.Address", "DistrictId");
            CreateIndex("dbo.Address", "CityId");
            CreateIndex("dbo.Address", "StreetId");
            CreateIndex("dbo.Address", "BuildingId");
            AddForeignKey("dbo.Address", "BuildingId", "kladr.Location", "LocationId");
            AddForeignKey("dbo.Address", "CityId", "kladr.Location", "LocationId");
            AddForeignKey("dbo.Address", "DistrictId", "kladr.Location", "LocationId");
            AddForeignKey("dbo.Address", "RegionId", "kladr.Location", "LocationId");
            AddForeignKey("dbo.Address", "StreetId", "kladr.Location", "LocationId");
            DropColumn("dbo.Address", "Street");
            DropColumn("dbo.Address", "Building");
            DropColumn("dbo.Address", "Code");
            DropColumn("dbo.Address", "Zip");
            DropColumn("dbo.Address", "Okato");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Address", "Okato", c => c.String());
            AddColumn("dbo.Address", "Zip", c => c.String());
            AddColumn("dbo.Address", "Code", c => c.String());
            AddColumn("dbo.Address", "Building", c => c.String(nullable: false, maxLength: 10));
            AddColumn("dbo.Address", "Street", c => c.String());
            DropForeignKey("dbo.Address", "StreetId", "kladr.Location");
            DropForeignKey("dbo.Address", "RegionId", "kladr.Location");
            DropForeignKey("dbo.Address", "DistrictId", "kladr.Location");
            DropForeignKey("dbo.Address", "CityId", "kladr.Location");
            DropForeignKey("dbo.Address", "BuildingId", "kladr.Location");
            DropForeignKey("kladr.Location", "ParentId", "kladr.Location");
            DropForeignKey("kladr.Location", "LocationTypeId", "kladr.LocationType");
            DropForeignKey("kladr.Location", "LocationLevelId", "kladr.LocationLevel");
            DropIndex("kladr.Location", new[] { "ParentId" });
            DropIndex("kladr.Location", new[] { "LocationTypeId" });
            DropIndex("kladr.Location", new[] { "LocationLevelId" });
            DropIndex("dbo.Address", new[] { "BuildingId" });
            DropIndex("dbo.Address", new[] { "StreetId" });
            DropIndex("dbo.Address", new[] { "CityId" });
            DropIndex("dbo.Address", new[] { "DistrictId" });
            DropIndex("dbo.Address", new[] { "RegionId" });
            DropColumn("dbo.Address", "BuildingId");
            DropColumn("dbo.Address", "StreetId");
            DropColumn("dbo.Address", "CityId");
            DropColumn("dbo.Address", "DistrictId");
            DropColumn("dbo.Address", "RegionId");
            DropTable("kladr.LocationType");
            DropTable("kladr.LocationLevel");
            DropTable("kladr.Location");
        }
    }
}
