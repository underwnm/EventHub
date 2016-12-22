using System.ComponentModel.DataAnnotations;

namespace EventHub.Models
{
    public class Time
    {
        public int Id { get; set; }

        [Required]
        public string DateTime { get; set; }

    }
}