using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Retailen.Application.Interfaces;
using Retailen.Infrastructure.Persistence;
using Retailen.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Retailen.Infrastructure.Services
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public JwtService(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public string GenerateAccessToken(Customer customer)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("Jwt:SecretKey is missing");
            var issuer = jwtSettings["Issuer"] ?? "Retailen";
            var audience = jwtSettings["Audience"] ?? "Retailen";
            var expirationStr = jwtSettings["AccessTokenExpirationMinutes"];
            var expirationMinutes = int.TryParse(expirationStr, out var mins) ? mins : 60;

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var roleName = customer.Role?.Name ?? "Customer";

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] 
                {
                    new Claim(JwtRegisteredClaimNames.Sub, customer.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, customer.Email ?? ""),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.Role, roleName)
                }),
                Expires = DateTime.UtcNow.AddMinutes(expirationMinutes),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public int? ValidateToken(string token)
        {
            if (token == null)
                return null;

            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? "";
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(secretKey);

            try
            {
                var issuer = jwtSettings["Issuer"] ?? "RetailApp";
                var audience = jwtSettings["Audience"] ?? "RetailAppUsers";

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidateAudience = true,
                    ValidAudience = audience,
                    ClockSkew = TimeSpan.Zero
                }, out var validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken!;
                var userIdStr = jwtToken.Claims.First(x => x.Type == JwtRegisteredClaimNames.Sub).Value;

                return int.Parse(userIdStr);
            }
            catch
            {
                return null;
            }
        }

        public async Task<RefreshToken> GenerateRefreshTokenAsync(string ipAddress)
        {
            var refreshToken = new RefreshToken
            {

                Token = await GetUniqueTokenAsync(),
                Expires = DateTime.UtcNow.AddDays(7),
                CreatedByIp = ipAddress,
                CreatedAt = DateTime.UtcNow
            };

            return refreshToken;

            async Task<string> GetUniqueTokenAsync()
            {
                const int maxAttempts = 10;
                for (int attempt = 0; attempt < maxAttempts; attempt++)
                {
                    var randomNumber = new byte[64];
                    using var rng = RandomNumberGenerator.Create();
                    rng.GetBytes(randomNumber);
                    var token = Convert.ToBase64String(randomNumber);

                    var tokenIsUnique = !await _context.RefreshTokens.AnyAsync(t => t.Token == token);
                    if (tokenIsUnique)
                        return token;
                }
                throw new InvalidOperationException("Unable to generate a unique refresh token after multiple attempts.");
            }
        }
    }
}