using System.ComponentModel.DataAnnotations;

namespace EventHub.Models
{
    public class Region
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Abbreviation { get; set; }
    }
}