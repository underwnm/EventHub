using EventHub.Dtos;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace EventHub.Models
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Region> Regions { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Venue> Venues { get; set; }
        public DbSet<Time> Times { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Following> Followings { get; set; }

        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {

        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Following>()
                .HasRequired(u => u.Event)
                .WithMany()
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Event>()
                .HasRequired(t => t.StartTime)
                .WithMany()
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Event>()
                .HasOptional(t => t.EndTime)
                .WithMany()
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Event>()
                .HasRequired(v => v.Venue)
                .WithMany()
                .WillCascadeOnDelete(false);

            base.OnModelCreating(modelBuilder);
        }

        public int GetCityId(string name, int regionId)
        {
            return Cities.Any(c => c.Name == name && c.RegionId == regionId) ? FindCityId(name, regionId) : CreateCity(name, regionId);
        }

        public int FindCityId(string name, int regionId)
        {
            return Cities
                    .Where(c => c.Name == name)
                    .Where(c => c.RegionId == regionId)
                    .Select(c => c.Id)
                    .Single();
        }

        public int CreateCity(string name, int regionId)
        {
            var city = new City
            {
                Name = name,
                RegionId = regionId
            };

            Cities.Add(city);
            SaveChanges();

            return city.Id;
        }

        public int GetRegionId(string name, string abbreviation)
        {
            return Regions.Any(r => r.Name == name) ? FindRegionId(name, abbreviation) : CreateRegion(name, abbreviation);
        }

        public int FindRegionId(string name, string abbreviation)
        {
            return Regions
                    .Where(r => r.Name == name)
                    .Select(r => r.Id)
                    .Single();
        }

        public int CreateRegion(string name, string abbreviation)
        {
            var region = new Region
            {
                Name = name,
                Abbreviation = abbreviation
            };

            Regions.Add(region);
            SaveChanges();

            return region.Id;
        }

        public int GetVenueId(string name, string address, int cityId)
        {
            return Venues.Any(v => v.Name == name && v.Address == address && v.CityId == cityId) ? FindVenueId(name, address, cityId) : CreateVenue(name, address, cityId);
        }

        public int FindVenueId(string name, string address, int cityId)
        {
            return Venues
                    .Where(v => v.Name == name)
                    .Where(v => v.Address == address)
                    .Where(v => v.CityId == cityId)
                    .Select(v => v.Id)
                    .Single();
        }

        public int CreateVenue(string name, string address, int cityId)
        {
            var venue = new Venue
            {
                Name = name,
                Address = address,
                CityId = cityId
            };

            Venues.Add(venue);
            SaveChanges();

            return venue.Id;
        }

        public int GetTimeId(string dateTime)
        {
            return Times.Any(t => t.DateTime == dateTime) ? FindTimeId(dateTime) : CreateTime(dateTime);
        }

        public int FindTimeId(string dateTime)
        {
            return Times
                    .Where(t => t.DateTime == dateTime)
                    .Select(t => t.Id)
                    .Single();
        }

        public int CreateTime(string dateTime)
        {
            var time = new Time
            {
                DateTime = dateTime
            };

            Times.Add(time);
            SaveChanges();

            return time.Id;
        }

        public int GetEventId(string title, int venueId, int startTimeId, string endTime, string imageUrl, string eventId)
        {
            return Events.Any(e => e.Title == title && e.VenueId == venueId && e.StartTimeId == startTimeId) ? FindEventId(title, venueId, startTimeId, endTime, imageUrl, eventId) : CreateEvent(title, venueId, startTimeId, endTime, imageUrl, eventId);
        }

        public int FindEventId(string title, int venueId, int startTimeId, string endTime, string imageUrl, string eventId)
        {
            return Events
                    .Where(e => e.Title == title)
                    .Where(e => e.VenueId == venueId)
                    .Where(e => e.StartTimeId == startTimeId)
                    .Where(x => x.EventId == eventId)
                    .Select(t => t.Id)
                    .Single();
        }

        public int CreateEvent(string title, int venueId, int startTimeId, string endTime, string imageUrl, string eventId)
        {
            var newEvent = new Event
            {
                Title = title,
                VenueId = venueId,
                StartTimeId = startTimeId,
                ImageUrl = imageUrl,
                EventId = eventId
            };

            if (endTime != "")
            {
                newEvent.EndTimeId = CreateTime(endTime);
            }

            Events.Add(newEvent);
            SaveChanges();

            return newEvent.Id;
        }

        public bool GetFollowing(string userId, int eventId)
        {
            if (Followings.Any(u => u.UserId == userId && u.EventId == eventId))
                return true;

            CreateFollowing(userId, eventId);
            return false;
        }

        public void CreateFollowing(string userId, int eventId)
        {
            var following = new Following
            {
                EventId = eventId,
                UserId = userId
            };
            Followings.Add(following);
            SaveChanges();
        }

        public List<int> GetUsersFollowings(string userId)
        {
            return Followings
                    .Where(f => f.UserId == userId)
                    .Select(f => f.EventId).ToList();
        }

        public FollowDto GetEventData(int myEventId)
        {
            Event eventData = GetEvent(myEventId);
            Venue venueData = GetVenue(eventData.VenueId);
            City cityData = GetCity(venueData.CityId);
            Region regionData = GetRegion(cityData.RegionId);
            Time startTimeData = GetTime(eventData.StartTimeId);
            Time endTimeData = null;
            if (eventData.EndTimeId != null)
            {
                endTimeData = GetTime(eventData.EndTimeId);
            }


            FollowDto dto = new FollowDto()
            {
                eventTitle = eventData.Title,
                imageUrl = eventData.ImageUrl,
                regionName = regionData.Name,
                regionAbbreviation = regionData.Abbreviation,
                cityName = cityData.Name,
                venueName = venueData.Name,
                venueAddress = venueData.Address,
                startTime = startTimeData.DateTime,
                eventId = eventData.EventId
            };
            if (endTimeData != null)
            {
                dto.endTime = endTimeData.DateTime;
            }
            return dto;
        }

        public Region GetRegion(int regionId)
        {
            return Regions
                    .Where(r => r.Id == regionId)
                    .Select(r => r)
                    .Single();
        }

        public City GetCity(int cityId)
        {
            return Cities
                    .Where(c => c.Id == cityId)
                    .Select(c => c)
                    .Single();
        }

        public Venue GetVenue(int venueId)
        {
            return Venues
                    .Where(v => v.Id == venueId)
                    .Select(v => v)
                    .Single();
        }

        public Time GetTime(int? timeId)
        {
            return Times
                    .Where(t => t.Id == timeId)
                    .Select(t => t)
                    .Single();
        }

        public Event GetEvent(int eventId)
        {
            return Events
                    .Where(e => e.Id == eventId)
                    .Select(e => e)
                    .Single();
        }

        public void DeleteFollowing(string userId, int eventId)
        {
            Following following = Followings
                .Where(f => f.UserId == userId)
                .Where(f => f.EventId == eventId)
                .Single();
            Followings.Remove(following);
            SaveChanges();
        }
    }
}