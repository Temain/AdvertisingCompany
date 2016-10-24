namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MakeCategoryRequiredInActivityType : DbMigration
    {
        public override void Up()
        {
            DropIndex("dict.ActivityType", new[] { "ActivityCategoryId" });
            AlterColumn("dict.ActivityType", "ActivityCategoryId", c => c.Int(nullable: false));
            CreateIndex("dict.ActivityType", "ActivityCategoryId");
            DropColumn("dict.ActivityType", "ActivityCategory");
        }
        
        public override void Down()
        {
            AddColumn("dict.ActivityType", "ActivityCategory", c => c.String(nullable: false));
            DropIndex("dict.ActivityType", new[] { "ActivityCategoryId" });
            AlterColumn("dict.ActivityType", "ActivityCategoryId", c => c.Int());
            CreateIndex("dict.ActivityType", "ActivityCategoryId");
        }
    }
}
