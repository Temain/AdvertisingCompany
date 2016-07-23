namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddImageFieldsToAddressReportTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AddressReport", "ImageName", c => c.String());
            AddColumn("dbo.AddressReport", "ImageLength", c => c.String());
            AddColumn("dbo.AddressReport", "ImageData", c => c.Binary());
            AddColumn("dbo.AddressReport", "ImageMimeType", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AddressReport", "ImageMimeType");
            DropColumn("dbo.AddressReport", "ImageData");
            DropColumn("dbo.AddressReport", "ImageLength");
            DropColumn("dbo.AddressReport", "ImageName");
        }
    }
}
