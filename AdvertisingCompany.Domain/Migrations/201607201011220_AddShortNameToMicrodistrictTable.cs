namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddShortNameToMicrodistrictTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dict.Microdistrict", "MicrodistrictShortName", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dict.Microdistrict", "MicrodistrictShortName");
        }
    }
}
