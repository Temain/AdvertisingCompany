namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemakeAddressTables : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Address", "AreaId", "dict.Area");
            DropForeignKey("dbo.Address", "CityId", "dict.City");
            DropForeignKey("dict.City", "AreaId", "dict.Area");
            DropForeignKey("dbo.Address", "StreetId", "dict.Street");
            DropForeignKey("dict.Street", "CityId", "dict.City");
            DropForeignKey("dict.Street", "MicrodistrictId", "dict.Microdistrict");
            DropIndex("dbo.Address", new[] { "AreaId" });
            DropIndex("dbo.Address", new[] { "CityId" });
            DropIndex("dbo.Address", new[] { "StreetId" });
            DropIndex("dict.City", new[] { "AreaId" });
            DropIndex("dict.Street", new[] { "CityId" });
            DropIndex("dict.Street", new[] { "MicrodistrictId" });
            AddColumn("dbo.Address", "Street", c => c.String());
            DropColumn("dbo.Address", "AreaId");
            DropColumn("dbo.Address", "CityId");
            DropColumn("dbo.Address", "StreetId");
            DropTable("dict.Area");
            DropTable("dict.City");
            DropTable("dict.Street");
        }
        
        public override void Down()
        {
            CreateTable(
                "dict.Street",
                c => new
                    {
                        StreetId = c.Int(nullable: false, identity: true),
                        StreetName = c.String(nullable: false),
                        StreetKladrCode = c.String(),
                        CityId = c.Int(nullable: false),
                        MicrodistrictId = c.Int(),
                    })
                .PrimaryKey(t => t.StreetId);
            
            CreateTable(
                "dict.City",
                c => new
                    {
                        CityId = c.Int(nullable: false, identity: true),
                        CityName = c.String(nullable: false),
                        CityKladrCode = c.String(),
                        AreaId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.CityId);
            
            CreateTable(
                "dict.Area",
                c => new
                    {
                        AreaId = c.Int(nullable: false, identity: true),
                        AreaName = c.String(nullable: false),
                        AreaKladrCode = c.String(),
                    })
                .PrimaryKey(t => t.AreaId);
            
            AddColumn("dbo.Address", "StreetId", c => c.Int(nullable: false));
            AddColumn("dbo.Address", "CityId", c => c.Int());
            AddColumn("dbo.Address", "AreaId", c => c.Int());
            DropColumn("dbo.Address", "Street");
            CreateIndex("dict.Street", "MicrodistrictId");
            CreateIndex("dict.Street", "CityId");
            CreateIndex("dict.City", "AreaId");
            CreateIndex("dbo.Address", "StreetId");
            CreateIndex("dbo.Address", "CityId");
            CreateIndex("dbo.Address", "AreaId");
            AddForeignKey("dict.Street", "MicrodistrictId", "dict.Microdistrict", "MicrodistrictId");
            AddForeignKey("dict.Street", "CityId", "dict.City", "CityId");
            AddForeignKey("dbo.Address", "StreetId", "dict.Street", "StreetId");
            AddForeignKey("dict.City", "AreaId", "dict.Area", "AreaId");
            AddForeignKey("dbo.Address", "CityId", "dict.City", "CityId");
            AddForeignKey("dbo.Address", "AreaId", "dict.Area", "AreaId");
        }
    }
}
