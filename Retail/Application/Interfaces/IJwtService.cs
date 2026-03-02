using Retailen.Domain.Entities;

namespace Retailen.Application.Interfaces
{
    public interface IJwtService
    {
        string GenerateAccessToken(Customer customer);
        int? ValidateToken(string token);
        Task<RefreshToken> GenerateRefreshTokenAsync(string ipAddress);
    }
}