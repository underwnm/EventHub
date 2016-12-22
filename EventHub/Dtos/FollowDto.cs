namespace EventHub.Dtos
{
    public class FollowDto
    {
        public string regionName { get; set; }
        public string regionAbbreviation { get; set; }
        public string cityName { get; set; }
        public string venueName { get; set; }
        public string venueAddress { get; set; }
        public string startTime { get; set; } 
        public string endTime { get; set; }
        public string eventTitle { get; set; }
        public string imageUrl { get; set; }
        public string eventId { get; set; }
    }
}