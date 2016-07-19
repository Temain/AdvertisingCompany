namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLabelClassFieldToClientStatus : DbMigration
    {
        public override void Up()
        {
            AddColumn("dict.ClientStatus", "LabelClass", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dict.ClientStatus", "LabelClass");
        }
    }
}
