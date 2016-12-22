namespace EventHub.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdatetimetabletostringinsteadofDateTime : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Times", "DateTime", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Times", "DateTime", c => c.DateTime(nullable: false));
        }
    }
}
