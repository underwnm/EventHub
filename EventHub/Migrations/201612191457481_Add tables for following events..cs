namespace EventHub.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Addtablesforfollowingevents : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Cities",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        RegionId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Regions", t => t.RegionId, cascadeDelete: true)
                .Index(t => t.RegionId);
            
            CreateTable(
                "dbo.Regions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        Abbreviation = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Events",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Title = c.String(nullable: false),
                        VenueId = c.Int(nullable: false),
                        StartTimeId = c.Int(nullable: false),
                        EndTimeId = c.Int(),
                        ImageUrl = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Times", t => t.EndTimeId)
                .ForeignKey("dbo.Times", t => t.StartTimeId)
                .ForeignKey("dbo.Venues", t => t.VenueId)
                .Index(t => t.VenueId)
                .Index(t => t.StartTimeId)
                .Index(t => t.EndTimeId);
            
            CreateTable(
                "dbo.Times",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DateTime = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Venues",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        Address = c.String(nullable: false),
                        CityId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Cities", t => t.CityId, cascadeDelete: true)
                .Index(t => t.CityId);
            
            CreateTable(
                "dbo.Followings",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        EventId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.UserId, t.EventId })
                .ForeignKey("dbo.Events", t => t.EventId)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.EventId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Followings", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Followings", "EventId", "dbo.Events");
            DropForeignKey("dbo.Events", "VenueId", "dbo.Venues");
            DropForeignKey("dbo.Venues", "CityId", "dbo.Cities");
            DropForeignKey("dbo.Events", "StartTimeId", "dbo.Times");
            DropForeignKey("dbo.Events", "EndTimeId", "dbo.Times");
            DropForeignKey("dbo.Cities", "RegionId", "dbo.Regions");
            DropIndex("dbo.Followings", new[] { "EventId" });
            DropIndex("dbo.Followings", new[] { "UserId" });
            DropIndex("dbo.Venues", new[] { "CityId" });
            DropIndex("dbo.Events", new[] { "EndTimeId" });
            DropIndex("dbo.Events", new[] { "StartTimeId" });
            DropIndex("dbo.Events", new[] { "VenueId" });
            DropIndex("dbo.Cities", new[] { "RegionId" });
            DropTable("dbo.Followings");
            DropTable("dbo.Venues");
            DropTable("dbo.Times");
            DropTable("dbo.Events");
            DropTable("dbo.Regions");
            DropTable("dbo.Cities");
        }
    }
}
