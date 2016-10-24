namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddActivityCategoryTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dict.ActivityType", "ActivityCategoryId", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("dict.ActivityType", "ActivityCategoryId");
        }
    }
}
