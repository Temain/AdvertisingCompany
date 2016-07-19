namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RenameLabelClassFieldInClientStatus : DbMigration
    {
        public override void Up()
        {
            AddColumn("dict.ClientStatus", "ClientStatusLabelClass", c => c.String());
            DropColumn("dict.ClientStatus", "LabelClass");
        }
        
        public override void Down()
        {
            AddColumn("dict.ClientStatus", "LabelClass", c => c.String());
            DropColumn("dict.ClientStatus", "ClientStatusLabelClass");
        }
    }
}
