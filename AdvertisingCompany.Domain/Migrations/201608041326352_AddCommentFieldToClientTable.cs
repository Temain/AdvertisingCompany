namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCommentFieldToClientTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Client", "Comment", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Client", "Comment");
        }
    }
}
