using EventHub.Dtos;
using EventHub.Models;
using Microsoft.AspNet.Identity;
using System.Collections.Generic;
using System.Web.Http;

namespace EventHub.Controllers.Api
{
    [Authorize]
    public class FollowingsController : ApiController
    {
        private readonly ApplicationDbContext _db;
        public FollowingsController()
        {
            _db = new ApplicationDbContext();
        }

        [HttpPost]
        public IHttpActionResult Follow(FollowDto dto)
        {
            var userId = User.Identity.GetUserId();

            var regionId = _db.GetRegionId(dto.regionName, dto.regionAbbreviation);
            var cityId = _db.GetCityId(dto.cityName, regionId);
            var venueId = _db.GetVenueId(dto.venueName, dto.venueAddress, cityId);
            var startTimeId = _db.GetTimeId(dto.startTime);
            var eventId = _db.GetEventId(dto.eventTitle, venueId, startTimeId, dto.endTime, dto.imageUrl, dto.eventId);

            if (!_db.GetFollowing(userId, eventId)) return Ok("followed");
            else
            {
                try
                {
                    Unfollow(userId, eventId);
                    return Ok("unfollowed");
                }
                catch
                {
                    return BadRequest("Failed to unfollow");
                }
            }
        }

        private void Unfollow(string userId, int eventId)
        {
            _db.DeleteFollowing(userId,eventId);
        }

        [HttpGet]
        public IHttpActionResult GetFollowings()
        {
            try
            {
                var userId = User.Identity.GetUserId();
                List<FollowDto> eventInfo = new List<FollowDto>();
                List<int> followings = _db.GetUsersFollowings(userId);

                foreach (int following in followings)
                {
                    eventInfo.Add(_db.GetEventData(following));
                }
                return Ok(eventInfo);
        }
            catch
            {
                return BadRequest("Error");
            }

        }
    }
}
