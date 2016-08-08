namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddActivityCategoryTable2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dict.ActivityCategory",
                c => new
                    {
                        ActivityCategoryId = c.Int(nullable: false, identity: true),
                        ActivityCategoryName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.ActivityCategoryId);
            
            CreateIndex("dict.ActivityType", "ActivityCategoryId");
            AddForeignKey("dict.ActivityType", "ActivityCategoryId", "dict.ActivityCategory", "ActivityCategoryId");
        }
        
        public override void Down()
        {
            DropForeignKey("dict.ActivityType", "ActivityCategoryId", "dict.ActivityCategory");
            DropIndex("dict.ActivityType", new[] { "ActivityCategoryId" });
            DropTable("dict.ActivityCategory");
        }
    }
}
