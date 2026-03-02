using Retailen.Application.DTO;
using Retailen.Application.DTO.Auth;

namespace Retailen.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthenticateResponseDTO> AuthenticateAsync(AuthenticateRequestDTO request, string ipAddress);
        Task<RegisterResponseDTO> RegisterAsync(RegisterRequestDTO request);
        Task<AuthenticateResponseDTO> RefreshTokenAsync(string token, string ipAddress);
        Task RevokeTokenAsync(string token, string ipAddress);
        Task<bool> ConfirmEmailAsync(string email, string token);
        Task ForgotPasswordAsync(ForgotPasswordRequestDTO request);
        Task<bool> ResetPasswordAsync(ResetPasswordRequestDTO request);
    }
}