namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddPaymentStatusLabelClass : DbMigration
    {
        public override void Up()
        {
            AddColumn("dict.PaymentStatus", "PaymentStatusLabelClass", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dict.PaymentStatus", "PaymentStatusLabelClass");
        }
    }
}
