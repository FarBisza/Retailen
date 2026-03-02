using System.ComponentModel.DataAnnotations;

namespace Retailen.Application.DTO.Auth
{
    public class AuthenticateRequestDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        public string? SessionId { get; set; }
    }
}