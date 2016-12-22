using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventHub.Models
{
    public class Following
    {
        [Key]
        [Column(Order = 1)]
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        [Key]
        [Column(Order = 2)]
        public int EventId { get; set; }
        public Event Event { get; set; }
    }
}