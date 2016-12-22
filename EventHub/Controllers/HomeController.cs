using EventHub.Models;
using System.Web.Mvc;

namespace EventHub.Controllers
{
    public class HomeController : Controller
    {
        private ApplicationDbContext _db;
        public ActionResult Index()
        {
            return View();
        }
    }
}