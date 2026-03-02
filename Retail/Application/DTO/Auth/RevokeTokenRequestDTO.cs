using System.ComponentModel.DataAnnotations;

namespace Retailen.Application.DTO.Auth
{
    public class RevokeTokenRequestDTO
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }   
}