using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventHub.Models
{
    public class Event
    {
        public int Id { get; set; }

        [Required]
        public string EventId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public int VenueId { get; set; }
        public Venue Venue { get; set; }

        [Required]
        [ForeignKey("StartTime")]
        public int StartTimeId { get; set; }
        public Time StartTime { get; set; }

        [ForeignKey("EndTime")]
        public int? EndTimeId { get; set; }
        public Time EndTime { get; set; }

        public string ImageUrl { get; set; }
    }
}