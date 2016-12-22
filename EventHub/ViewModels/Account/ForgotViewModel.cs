using System.ComponentModel.DataAnnotations;

namespace EventHub.ViewModels.Account
{
    public class ForgotViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }
}