namespace EventHub.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddEventIdtoEventstable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "EventId", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Events", "EventId");
        }
    }
}
