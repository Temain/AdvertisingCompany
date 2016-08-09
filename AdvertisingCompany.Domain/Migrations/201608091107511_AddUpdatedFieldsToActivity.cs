namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUpdatedFieldsToActivity : DbMigration
    {
        public override void Up()
        {
            AddColumn("dict.ActivityCategory", "CreatedAt", c => c.DateTime());
            AddColumn("dict.ActivityCategory", "UpdatedAt", c => c.DateTime());
            AddColumn("dict.ActivityCategory", "DeletedAt", c => c.DateTime());
            AddColumn("dict.ActivityType", "CreatedAt", c => c.DateTime());
            AddColumn("dict.ActivityType", "UpdatedAt", c => c.DateTime());
            AddColumn("dict.ActivityType", "DeletedAt", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dict.ActivityType", "DeletedAt");
            DropColumn("dict.ActivityType", "UpdatedAt");
            DropColumn("dict.ActivityType", "CreatedAt");
            DropColumn("dict.ActivityCategory", "DeletedAt");
            DropColumn("dict.ActivityCategory", "UpdatedAt");
            DropColumn("dict.ActivityCategory", "CreatedAt");
        }
    }
}
