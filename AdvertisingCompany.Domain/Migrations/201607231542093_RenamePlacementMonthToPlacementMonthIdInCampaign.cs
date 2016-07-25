namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RenamePlacementMonthToPlacementMonthIdInCampaign : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Campaign", "PlacementMonthId", c => c.Int(nullable: false));
            DropColumn("dbo.Campaign", "PlacementMonth");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Campaign", "PlacementMonth", c => c.Int(nullable: false));
            DropColumn("dbo.Campaign", "PlacementMonthId");
        }
    }
}
