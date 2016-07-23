namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangeTypeToLongImageLengthInAddressReport : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.AddressReport", "ImageLength", c => c.Long());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.AddressReport", "ImageLength", c => c.String());
        }
    }
}
