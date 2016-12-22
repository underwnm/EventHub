using System.ComponentModel.DataAnnotations;

namespace EventHub.Models
{
    public class Venue
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public int CityId { get; set; }
        public City City { get; set; }

    }
}