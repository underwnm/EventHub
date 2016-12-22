using System.ComponentModel.DataAnnotations;

namespace EventHub.Models
{
    public class City
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public int RegionId { get; set; }
        public Region Region { get; set; }
    }
}