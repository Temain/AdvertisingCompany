namespace AdvertisingCompany.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dict.ActivityType",
                c => new
                    {
                        ActivityTypeId = c.Int(nullable: false, identity: true),
                        ActivityTypeName = c.String(nullable: false),
                        ActivityCategory = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.ActivityTypeId);
            
            CreateTable(
                "dbo.Client",
                c => new
                    {
                        ClientId = c.Int(nullable: false, identity: true),
                        CompanyName = c.String(nullable: false),
                        ActivityTypeId = c.Int(nullable: false),
                        ResponsiblePersonId = c.Int(nullable: false),
                        PhoneNumber = c.String(nullable: false),
                        AdditionalPhoneNumber = c.String(),
                        Email = c.String(),
                        ClientStatusId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ClientId)
                .ForeignKey("dict.ActivityType", t => t.ActivityTypeId)
                .ForeignKey("dict.ClientStatus", t => t.ClientStatusId)
                .ForeignKey("dbo.Person", t => t.ResponsiblePersonId)
                .Index(t => t.ActivityTypeId)
                .Index(t => t.ResponsiblePersonId)
                .Index(t => t.ClientStatusId);
            
            CreateTable(
                "dict.ClientStatus",
                c => new
                    {
                        ClientStatusId = c.Int(nullable: false, identity: true),
                        ClientStatusName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.ClientStatusId);
            
            CreateTable(
                "dbo.Person",
                c => new
                    {
                        PersonId = c.Int(nullable: false, identity: true),
                        LastName = c.String(nullable: false, maxLength: 500),
                        FirstName = c.String(nullable: false, maxLength: 500),
                        MiddleName = c.String(maxLength: 500),
                        Birthday = c.DateTime(),
                        CreatedAt = c.DateTime(),
                        UpdatedAt = c.DateTime(),
                        DeletedAt = c.DateTime(),
                    })
                .PrimaryKey(t => t.PersonId);
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        PersonId = c.Int(),
                        ClientId = c.Int(),
                        CreatedAt = c.DateTime(nullable: false),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Client", t => t.ClientId)
                .ForeignKey("dbo.Person", t => t.PersonId)
                .Index(t => t.PersonId)
                .Index(t => t.ClientId)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId)
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.Address",
                c => new
                    {
                        AddressId = c.Int(nullable: false, identity: true),
                        ManagementCompanyName = c.String(nullable: false),
                        AreaId = c.Int(),
                        CityId = c.Int(),
                        MicrodistrictId = c.Int(nullable: false),
                        StreetId = c.Int(nullable: false),
                        HouseNumber = c.String(nullable: false),
                        BuildingNumber = c.String(),
                        NumberOfEntrances = c.Int(nullable: false),
                        NumberOfSurfaces = c.Int(nullable: false),
                        NumberOfFloors = c.Int(nullable: false),
                        ContractDate = c.DateTime(),
                    })
                .PrimaryKey(t => t.AddressId)
                .ForeignKey("dict.Area", t => t.AreaId)
                .ForeignKey("dict.City", t => t.CityId)
                .ForeignKey("dict.Street", t => t.StreetId)
                .ForeignKey("dict.Microdistrict", t => t.MicrodistrictId)
                .Index(t => t.AreaId)
                .Index(t => t.CityId)
                .Index(t => t.MicrodistrictId)
                .Index(t => t.StreetId);
            
            CreateTable(
                "dict.Area",
                c => new
                    {
                        AreaId = c.Int(nullable: false, identity: true),
                        AreaName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.AreaId);
            
            CreateTable(
                "dict.City",
                c => new
                    {
                        CityId = c.Int(nullable: false, identity: true),
                        CityName = c.String(nullable: false),
                        CityKladrCode = c.String(),
                        AreaId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.CityId)
                .ForeignKey("dict.Area", t => t.AreaId)
                .Index(t => t.AreaId);
            
            CreateTable(
                "dict.Street",
                c => new
                    {
                        StreetId = c.Int(nullable: false, identity: true),
                        StreetName = c.String(nullable: false),
                        StreetKladrCode = c.String(),
                        CityId = c.Int(nullable: false),
                        MicrodistrictId = c.Int(),
                    })
                .PrimaryKey(t => t.StreetId)
                .ForeignKey("dict.City", t => t.CityId)
                .ForeignKey("dict.Microdistrict", t => t.MicrodistrictId)
                .Index(t => t.CityId)
                .Index(t => t.MicrodistrictId);
            
            CreateTable(
                "dict.Microdistrict",
                c => new
                    {
                        MicrodistrictId = c.Int(nullable: false, identity: true),
                        MicrodistrictName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.MicrodistrictId);
            
            CreateTable(
                "dbo.Campaign",
                c => new
                    {
                        CampaignId = c.Int(nullable: false, identity: true),
                        ClientId = c.Int(nullable: false),
                        PlacementMonth = c.Int(nullable: false),
                        PlacementFormatId = c.Int(nullable: false),
                        PlacementCost = c.Double(nullable: false),
                        PaymentOrderId = c.Int(nullable: false),
                        Comment = c.String(),
                    })
                .PrimaryKey(t => t.CampaignId)
                .ForeignKey("dbo.Client", t => t.ClientId)
                .ForeignKey("dict.PaymentOrder", t => t.PaymentOrderId)
                .ForeignKey("dict.PlacementFormat", t => t.PlacementFormatId)
                .Index(t => t.ClientId)
                .Index(t => t.PlacementFormatId)
                .Index(t => t.PaymentOrderId);
            
            CreateTable(
                "dict.PaymentOrder",
                c => new
                    {
                        PaymentOrderId = c.Int(nullable: false, identity: true),
                        PaymentOrderName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.PaymentOrderId);
            
            CreateTable(
                "dict.PlacementFormat",
                c => new
                    {
                        PlacementFormatId = c.Int(nullable: false, identity: true),
                        PlacementFormatName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.PlacementFormatId);
            
            CreateTable(
                "dbo.AddressReport",
                c => new
                    {
                        AddressReportId = c.Int(nullable: false, identity: true),
                        ReportDate = c.DateTime(nullable: false),
                        AddressId = c.Int(nullable: false),
                        Comment = c.String(),
                    })
                .PrimaryKey(t => t.AddressReportId)
                .ForeignKey("dbo.Address", t => t.AddressId)
                .Index(t => t.AddressId);
            
            CreateTable(
                "serv.LogEntry",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Date = c.String(),
                        Level = c.String(),
                        Logger = c.String(),
                        ClassMethod = c.String(),
                        Message = c.String(),
                        Username = c.String(),
                        RequestUri = c.String(),
                        RemoteAddress = c.String(),
                        UserAgent = c.String(),
                        Exception = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dict.PaymentStatus",
                c => new
                    {
                        PaymentStatusId = c.Int(nullable: false, identity: true),
                        PaymentStatusName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.PaymentStatusId);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                        FullName = c.String(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
            CreateTable(
                "dbo.CampaignMicrodistricts",
                c => new
                    {
                        CampaignId = c.Int(nullable: false),
                        MicrodistrictId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.CampaignId, t.MicrodistrictId })
                .ForeignKey("dbo.Campaign", t => t.CampaignId)
                .ForeignKey("dict.Microdistrict", t => t.MicrodistrictId)
                .Index(t => t.CampaignId)
                .Index(t => t.MicrodistrictId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.AddressReport", "AddressId", "dbo.Address");
            DropForeignKey("dict.Street", "MicrodistrictId", "dict.Microdistrict");
            DropForeignKey("dbo.Campaign", "PlacementFormatId", "dict.PlacementFormat");
            DropForeignKey("dbo.Campaign", "PaymentOrderId", "dict.PaymentOrder");
            DropForeignKey("dbo.CampaignMicrodistricts", "MicrodistrictId", "dict.Microdistrict");
            DropForeignKey("dbo.CampaignMicrodistricts", "CampaignId", "dbo.Campaign");
            DropForeignKey("dbo.Campaign", "ClientId", "dbo.Client");
            DropForeignKey("dbo.Address", "MicrodistrictId", "dict.Microdistrict");
            DropForeignKey("dict.Street", "CityId", "dict.City");
            DropForeignKey("dbo.Address", "StreetId", "dict.Street");
            DropForeignKey("dict.City", "AreaId", "dict.Area");
            DropForeignKey("dbo.Address", "CityId", "dict.City");
            DropForeignKey("dbo.Address", "AreaId", "dict.Area");
            DropForeignKey("dbo.Client", "ResponsiblePersonId", "dbo.Person");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUsers", "PersonId", "dbo.Person");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUsers", "ClientId", "dbo.Client");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Client", "ClientStatusId", "dict.ClientStatus");
            DropForeignKey("dbo.Client", "ActivityTypeId", "dict.ActivityType");
            DropIndex("dbo.CampaignMicrodistricts", new[] { "MicrodistrictId" });
            DropIndex("dbo.CampaignMicrodistricts", new[] { "CampaignId" });
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropIndex("dbo.AddressReport", new[] { "AddressId" });
            DropIndex("dbo.Campaign", new[] { "PaymentOrderId" });
            DropIndex("dbo.Campaign", new[] { "PlacementFormatId" });
            DropIndex("dbo.Campaign", new[] { "ClientId" });
            DropIndex("dict.Street", new[] { "MicrodistrictId" });
            DropIndex("dict.Street", new[] { "CityId" });
            DropIndex("dict.City", new[] { "AreaId" });
            DropIndex("dbo.Address", new[] { "StreetId" });
            DropIndex("dbo.Address", new[] { "MicrodistrictId" });
            DropIndex("dbo.Address", new[] { "CityId" });
            DropIndex("dbo.Address", new[] { "AreaId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.AspNetUsers", new[] { "ClientId" });
            DropIndex("dbo.AspNetUsers", new[] { "PersonId" });
            DropIndex("dbo.Client", new[] { "ClientStatusId" });
            DropIndex("dbo.Client", new[] { "ResponsiblePersonId" });
            DropIndex("dbo.Client", new[] { "ActivityTypeId" });
            DropTable("dbo.CampaignMicrodistricts");
            DropTable("dbo.AspNetRoles");
            DropTable("dict.PaymentStatus");
            DropTable("serv.LogEntry");
            DropTable("dbo.AddressReport");
            DropTable("dict.PlacementFormat");
            DropTable("dict.PaymentOrder");
            DropTable("dbo.Campaign");
            DropTable("dict.Microdistrict");
            DropTable("dict.Street");
            DropTable("dict.City");
            DropTable("dict.Area");
            DropTable("dbo.Address");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.Person");
            DropTable("dict.ClientStatus");
            DropTable("dbo.Client");
            DropTable("dict.ActivityType");
        }
    }
}
