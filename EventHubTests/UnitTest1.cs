using EventHub.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace EventHubTests
{
    [TestClass]
    public class UnitTest1
    {
        ApplicationDbContext db = new ApplicationDbContext();

        [TestMethod]
        public void RegionTests()
        {

        }

        [TestMethod]
        public void AddCityToDatabase()
        {
            db.GetRegionId("name", "wi");
        }
    }
}
