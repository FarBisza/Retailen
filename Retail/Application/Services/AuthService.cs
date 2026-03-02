using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Retailen.Application.DTO;
using Retailen.Application.DTO.Auth;
using Retailen.Application.Interfaces;
using Retailen.Domain.Entities;
using Retailen.Domain.Exceptions;
using Retailen.Domain.Interfaces;

namespace Retailen.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly ICustomerRepository _customerRepo;
        private readonly IJwtService _jwtService;
        private readonly IPasswordService _passwordService;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly ICartService _cartService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            ICustomerRepository customerRepo,
            IJwtService jwtService,
            IPasswordService passwordService,
            IMapper mapper,
            IEmailService emailService,
            ICartService cartService,
            IConfiguration configuration,
            ILogger<AuthService> logger)
        {
            _customerRepo = customerRepo;
            _jwtService = jwtService;
            _passwordService = passwordService;
            _mapper = mapper;
            _emailService = emailService;
            _cartService = cartService;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<AuthenticateResponseDTO> AuthenticateAsync(AuthenticateRequestDTO request, string ipAddress)
        {
            var customer = await _customerRepo.GetByEmailAsync(request.Email);

            if (customer == null || !_passwordService.VerifyPassword(request.Password, customer.HashedPassword ?? ""))
            {
                throw new UnauthorizedAccessException("Invalid login credentials");
            }

            if (!customer.EmailConfirmed)
            {
                throw new UnauthorizedAccessException("Email has not been confirmed. Please check your inbox.");
            }

            if (!customer.Active)
            {
                throw new AccessDeniedException("Account has been deactivated. Please contact support.");
            }

            if (!string.IsNullOrEmpty(request.SessionId))
            {
                await _cartService.MergeCartAsync(customer.Id, request.SessionId);
            }

            var jwtToken = _jwtService.GenerateAccessToken(customer);
            var refreshToken = await _jwtService.GenerateRefreshTokenAsync(ipAddress);

            customer.RefreshTokens.Add(refreshToken);

            RemoveOldRefreshTokens(customer);

            await _customerRepo.SaveChangesAsync();

            var response = _mapper.Map<AuthenticateResponseDTO>(customer);
            response.AccessToken = jwtToken;
            response.RefreshToken = refreshToken.Token;
            response.TokenExpiryTime = DateTime.UtcNow.AddMinutes(15);

            response.Role = customer.Role?.Name ?? "Customer";

            return response;
        }

        public async Task<AuthenticateResponseDTO> RefreshTokenAsync(string token, string ipAddress)
        {
            var customer = await GetUserByRefreshTokenAsync(token);
            var refreshToken = customer.RefreshTokens.Single(x => x.Token == token);

            if (refreshToken.IsRevoked)
            {
                RevokeDescendantRefreshTokens(refreshToken, customer, ipAddress, $"Attempted reuse of revoked ancestor token: {token}");
                await _customerRepo.UpdateAsync(customer);
                await _customerRepo.SaveChangesAsync();
            }

            if (!refreshToken.IsActive)
                throw new UnauthorizedAccessException("Invalid token");

            if (!customer.Active)
                throw new AccessDeniedException("Account has been deactivated. Please contact support.");

            var newRefreshToken = await RotateRefreshTokenAsync(refreshToken, ipAddress);
            customer.RefreshTokens.Add(newRefreshToken);

            RemoveOldRefreshTokens(customer);

            await _customerRepo.SaveChangesAsync();

            var jwtToken = _jwtService.GenerateAccessToken(customer);

            var response = _mapper.Map<AuthenticateResponseDTO>(customer);
            response.AccessToken = jwtToken;
            response.RefreshToken = newRefreshToken.Token;
            response.TokenExpiryTime = DateTime.UtcNow.AddMinutes(15);

            return response;
        }

        public async Task<RegisterResponseDTO> RegisterAsync(RegisterRequestDTO request)
        {
            var emailExists = await _customerRepo.EmailExistsAsync(request.Email);

            if (emailExists)
            {
                throw new InvalidOperationException("Email already exists in the system");
            }

            var hashedPassword = _passwordService.HashPassword(request.Password);

            var confirmationToken = Guid.NewGuid().ToString();

            var customer = new Customer
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email.ToLowerInvariant(),
                HashedPassword = hashedPassword,
                Phone = request.Phone,
                EmailConfirmed = false,
                EmailConfirmationToken = confirmationToken
            };

            await _customerRepo.AddAsync(customer);
            await _customerRepo.SaveChangesAsync();

            try
            {
                var backendUrl = _configuration["AppUrls:BackendBaseUrl"] ?? "http://localhost:5200";
                var confirmationLink = $"{backendUrl}/api/Auth/confirm-email?token={confirmationToken}&email={customer.Email}";
                var emailSubject = "Confirm your email address";
                var emailBody = $@"
                    <h2>Welcome {customer.FirstName}!</h2>
                    <p>Thank you for registering at our store.</p>
                    <p>Click the link below to confirm your email address:</p>
                    <a href='{confirmationLink}'>Confirm email</a>
                    <p>If you did not register on our site, please ignore this message.</p>
                ";

                await _emailService.SendEmailAsync(customer.Email, emailSubject, emailBody);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send confirmation email to {Email}", customer.Email);
            }

            return _mapper.Map<RegisterResponseDTO>(customer);
        }

        public async Task RevokeTokenAsync(string token, string ipAddress)
        {
            var customer = await GetUserByRefreshTokenAsync(token);
            var refreshToken = customer.RefreshTokens.Single(x => x.Token == token);

            if (!refreshToken.IsActive)
                throw new UnauthorizedAccessException("Invalid token");

            RevokeRefreshToken(refreshToken, ipAddress, "Revoked without replacement");
            await _customerRepo.UpdateAsync(customer);
            await _customerRepo.SaveChangesAsync();
        }

        public async Task<bool> ConfirmEmailAsync(string email, string token)
        {
            var customer = await _customerRepo.GetByEmailAndConfirmationTokenAsync(email, token);

            if (customer == null)
                return false;

            if (customer.EmailConfirmed)
                return true;

            customer.EmailConfirmed = true;
            customer.EmailConfirmationToken = null;
            await _customerRepo.SaveChangesAsync();

            return true;
        }

        private async Task<Customer> GetUserByRefreshTokenAsync(string token)
        {
            var customer = await _customerRepo.GetByRefreshTokenAsync(token);

            if (customer == null)
                throw new UnauthorizedAccessException("Invalid token");

            return customer;
        }

        private async Task<RefreshToken> RotateRefreshTokenAsync(RefreshToken refreshToken, string ipAddress)
        {
            var newRefreshToken = await _jwtService.GenerateRefreshTokenAsync(ipAddress);
            RevokeRefreshToken(refreshToken, ipAddress, "Replaced by new token", newRefreshToken.Token);
            return newRefreshToken;
        }

        private void RemoveOldRefreshTokens(Customer customer)
        {
            customer.RefreshTokens = customer.RefreshTokens.ToList();

            var tokensToRemove = customer.RefreshTokens
                .Where(x => !x.IsActive && (x.CreatedAt ?? DateTime.MinValue).AddDays(2) <= DateTime.UtcNow)
                .ToList();

            foreach (var token in tokensToRemove)
            {
                customer.RefreshTokens.Remove(token);
            }
        }

        private void RevokeDescendantRefreshTokens(RefreshToken refreshToken, Customer customer, string ipAddress, string reason)
        {
            if (!string.IsNullOrEmpty(refreshToken.ReplacedByToken))
            {
                var childToken = customer.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken.ReplacedByToken);
                if (childToken != null)
                {
                    if (childToken.IsActive)
                        RevokeRefreshToken(childToken, ipAddress, reason);
                    else
                        RevokeDescendantRefreshTokens(childToken, customer, ipAddress, reason);
                }
            }
        }

        public async Task ForgotPasswordAsync(ForgotPasswordRequestDTO request)
        {
            var customer = await _customerRepo.GetByEmailAsync(request.Email);

            if (customer == null) return;

            var token = Guid.NewGuid().ToString();
            customer.PasswordResetToken = token;
            customer.ResetTokenExpires = DateTime.UtcNow.AddHours(1);

            await _customerRepo.SaveChangesAsync();

            try
            {
                var frontendUrl = _configuration["AppUrls:FrontendBaseUrl"] ?? "http://localhost:3000";
                var resetLink = $"{frontendUrl}/reset-password?token={token}&email={customer.Email}";
                var emailSubject = "Reset your password";
                var emailBody = $@"
                    <h2>Hello {customer.FirstName},</h2>
                    <p>You requested a password reset.</p>
                    <p>Click the link below to set a new password:</p>
                    <a href='{resetLink}'>Reset Password</a>
                    <p>This link expires in 1 hour.</p>
                    <p>If you did not request this, please ignore this email.</p>
                ";

                if (!string.IsNullOrEmpty(customer.Email))
                {
                    await _emailService.SendEmailAsync(customer.Email, emailSubject, emailBody);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send reset email to {Email}", customer.Email);
            }
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordRequestDTO request)
        {
            var customer = await _customerRepo.GetByEmailAndResetTokenAsync(request.Email, request.Token);

            if (customer == null)
                return false;

            customer.HashedPassword = _passwordService.HashPassword(request.NewPassword);

            customer.PasswordResetToken = null;
            customer.ResetTokenExpires = null;

            await _customerRepo.SaveChangesAsync();

            return true;
        }

        private void RevokeRefreshToken(RefreshToken token, string ipAddress, string? reason = null, string? replacedByToken = null)
        {
            token.Revoked = DateTime.UtcNow;
            token.RevokedByIp = ipAddress;
            token.ReasonRevoked = reason;
            token.ReplacedByToken = replacedByToken;
        }
    }
}