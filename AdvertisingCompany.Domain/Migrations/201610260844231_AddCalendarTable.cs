namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCalendarTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Calendar",
                c => new
                    {
                        CalendarId = c.Int(nullable: false, identity: true),
                        Title = c.String(nullable: false),
                        Start = c.DateTime(),
                        End = c.DateTime(),
                        AllDay = c.Boolean(nullable: false),
                        Color = c.String(),
                    })
                .PrimaryKey(t => t.CalendarId);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Calendar");
        }
    }
}
