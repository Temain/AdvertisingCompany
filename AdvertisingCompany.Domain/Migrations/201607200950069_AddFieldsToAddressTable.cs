namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddFieldsToAddressTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Address", "Code", c => c.String());
            AddColumn("dbo.Address", "Zip", c => c.String());
            AddColumn("dbo.Address", "Okato", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Address", "Okato");
            DropColumn("dbo.Address", "Zip");
            DropColumn("dbo.Address", "Code");
        }
    }
}
