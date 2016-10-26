namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddApplicationUserToCalendar : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Calendar", "ApplicationUserId", c => c.String(maxLength: 128));
            CreateIndex("dbo.Calendar", "ApplicationUserId");
            AddForeignKey("dbo.Calendar", "ApplicationUserId", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Calendar", "ApplicationUserId", "dbo.AspNetUsers");
            DropIndex("dbo.Calendar", new[] { "ApplicationUserId" });
            DropColumn("dbo.Calendar", "ApplicationUserId");
        }
    }
}
