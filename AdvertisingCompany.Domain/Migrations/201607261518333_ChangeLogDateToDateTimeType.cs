namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangeLogDateToDateTimeType : DbMigration
    {
        public override void Up()
        {
            AlterColumn("serv.LogEntry", "Date", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("serv.LogEntry", "Date", c => c.String());
        }
    }
}
