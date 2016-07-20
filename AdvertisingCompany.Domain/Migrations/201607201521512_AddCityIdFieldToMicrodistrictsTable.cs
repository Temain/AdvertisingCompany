namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCityIdFieldToMicrodistrictsTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dict.Microdistrict", "CityId", c => c.Int(nullable: false));
            CreateIndex("dict.Microdistrict", "CityId");
            AddForeignKey("dict.Microdistrict", "CityId", "kladr.Location", "LocationId");
        }
        
        public override void Down()
        {
            DropForeignKey("dict.Microdistrict", "CityId", "kladr.Location");
            DropIndex("dict.Microdistrict", new[] { "CityId" });
            DropColumn("dict.Microdistrict", "CityId");
        }
    }
}
