using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Retailen.Application.DTO.Auth;
using Retailen.Application.Interfaces;
using Retailen.Application.Services;
using Retailen.Domain.Entities;
using Retailen.Domain.Interfaces;

namespace Retailen.Tests.Unit
{
    public class AuthServiceTests : IDisposable
    {
        private readonly AuthService _service;
        private readonly Mock<ICustomerRepository> _customerRepoMock;
        private readonly Mock<IJwtService> _jwtMock;
        private readonly Mock<IPasswordService> _passwordMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IEmailService> _emailMock;
        private readonly Mock<ICartService> _cartMock;
        private readonly Mock<IConfiguration> _configMock;
        private readonly Mock<ILogger<AuthService>> _loggerMock;

        public AuthServiceTests()
        {
            _customerRepoMock = new Mock<ICustomerRepository>();
            _jwtMock = new Mock<IJwtService>();
            _passwordMock = new Mock<IPasswordService>();
            _mapperMock = new Mock<IMapper>();
            _emailMock = new Mock<IEmailService>();
            _cartMock = new Mock<ICartService>();
            _configMock = new Mock<IConfiguration>();
            _loggerMock = new Mock<ILogger<AuthService>>();

            _passwordMock.Setup(p => p.HashPassword(It.IsAny<string>()))
                .Returns((string pwd) => $"hashed_{pwd}");
            _passwordMock.Setup(p => p.VerifyPassword(It.IsAny<string>(), It.IsAny<string>()))
                .Returns((string pwd, string hash) => hash == $"hashed_{pwd}");

            _mapperMock.Setup(m => m.Map<RegisterResponseDTO>(It.IsAny<Customer>()))
                .Returns((Customer c) => new RegisterResponseDTO
                {
                    Success = true,
                    Message = "Registration successful"
                });

            _service = new AuthService(
                _customerRepoMock.Object, _jwtMock.Object, _passwordMock.Object,
                _mapperMock.Object, _emailMock.Object, _cartMock.Object,
                _configMock.Object, _loggerMock.Object);
        }

        public void Dispose() { }

        // ───────────────── Registration Tests ─────────────────

        [Fact]
        public async Task Register_ValidData_CreatesCustomer()
        {
            _customerRepoMock.Setup(r => r.EmailExistsAsync(It.IsAny<string>()))
                .ReturnsAsync(false);

            var request = new RegisterRequestDTO
            {
                Email = "new@example.com",
                Password = "Password123",
                FirstName = "New",
                LastName = "User",
                Phone = "987654321"
            };

            var result = await _service.RegisterAsync(request);

            Assert.NotNull(result);
            Assert.True(result.Success);
            _customerRepoMock.Verify(r => r.AddAsync(It.Is<Customer>(c =>
                c.Email == "new@example.com" && c.FirstName == "New" && !c.EmailConfirmed)),
                Times.Once);
            _customerRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task Register_DuplicateEmail_ThrowsInvalidOperation()
        {
            _customerRepoMock.Setup(r => r.EmailExistsAsync("existing@example.com"))
                .ReturnsAsync(true);

            var request = new RegisterRequestDTO
            {
                Email = "existing@example.com",
                Password = "Password123",
                FirstName = "Dup",
                LastName = "User"
            };

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _service.RegisterAsync(request));
        }

        // ───────────────── Authentication Tests ─────────────────

        [Fact]
        public async Task Authenticate_InvalidCredentials_ThrowsUnauthorized()
        {
            _customerRepoMock.Setup(r => r.GetByEmailAsync("user@example.com"))
                .ReturnsAsync(new Customer
                {
                    Email = "user@example.com",
                    HashedPassword = "hashed_CorrectPass",
                    EmailConfirmed = true,
                    RefreshTokens = new List<RefreshToken>()
                });

            var request = new AuthenticateRequestDTO
            {
                Email = "user@example.com",
                Password = "WrongPass"
            };

            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _service.AuthenticateAsync(request, "127.0.0.1"));
        }

        [Fact]
        public async Task Authenticate_UnconfirmedEmail_ThrowsUnauthorized()
        {
            _customerRepoMock.Setup(r => r.GetByEmailAsync("unconfirmed@example.com"))
                .ReturnsAsync(new Customer
                {
                    Email = "unconfirmed@example.com",
                    HashedPassword = "hashed_Password123",
                    EmailConfirmed = false,
                    RefreshTokens = new List<RefreshToken>()
                });

            var request = new AuthenticateRequestDTO
            {
                Email = "unconfirmed@example.com",
                Password = "Password123"
            };

            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _service.AuthenticateAsync(request, "127.0.0.1"));
        }

        // ───────────────── Password Reset Tests ─────────────────

        [Fact]
        public async Task ForgotPassword_ExistingUser_SetsResetToken()
        {
            var customer = new Customer
            {
                Email = "reset@example.com",
                FirstName = "Test",
                EmailConfirmed = true,
                RefreshTokens = new List<RefreshToken>()
            };
            _customerRepoMock.Setup(r => r.GetByEmailAsync("reset@example.com"))
                .ReturnsAsync(customer);

            var request = new ForgotPasswordRequestDTO { Email = "reset@example.com" };
            await _service.ForgotPasswordAsync(request);

            Assert.NotNull(customer.PasswordResetToken);
            Assert.NotNull(customer.ResetTokenExpires);
            Assert.True(customer.ResetTokenExpires > DateTime.UtcNow);
            _customerRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task ForgotPassword_NonExistingUser_DoesNotThrow()
        {
            _customerRepoMock.Setup(r => r.GetByEmailAsync("nonexistent@example.com"))
                .ReturnsAsync((Customer?)null);

            var request = new ForgotPasswordRequestDTO { Email = "nonexistent@example.com" };

            await _service.ForgotPasswordAsync(request);
        }

        [Fact]
        public async Task ResetPassword_ValidToken_UpdatesPassword()
        {
            var customer = new Customer
            {
                Email = "resetpwd@example.com",
                HashedPassword = "hashed_OldPass",
                PasswordResetToken = "valid-token",
                ResetTokenExpires = DateTime.UtcNow.AddHours(1),
                RefreshTokens = new List<RefreshToken>()
            };
            _customerRepoMock.Setup(r => r.GetByEmailAndResetTokenAsync("resetpwd@example.com", "valid-token"))
                .ReturnsAsync(customer);

            var request = new ResetPasswordRequestDTO
            {
                Email = "resetpwd@example.com",
                Token = "valid-token",
                NewPassword = "NewPassword123"
            };

            var result = await _service.ResetPasswordAsync(request);

            Assert.True(result);
            Assert.Null(customer.PasswordResetToken);
            Assert.Equal("hashed_NewPassword123", customer.HashedPassword);
        }

        [Fact]
        public async Task ResetPassword_ExpiredToken_ReturnsFalse()
        {
            _customerRepoMock.Setup(r => r.GetByEmailAndResetTokenAsync("expired@example.com", "expired-token"))
                .ReturnsAsync((Customer?)null);

            var request = new ResetPasswordRequestDTO
            {
                Email = "expired@example.com",
                Token = "expired-token",
                NewPassword = "NewPass123"
            };

            var result = await _service.ResetPasswordAsync(request);

            Assert.False(result);
        }

        // ───────────────── Email Confirmation Tests ─────────────────

        [Fact]
        public async Task ConfirmEmail_ValidToken_SetsEmailConfirmed()
        {
            var customer = new Customer
            {
                Email = "confirm@example.com",
                EmailConfirmed = false,
                EmailConfirmationToken = "confirm-token",
                RefreshTokens = new List<RefreshToken>()
            };
            _customerRepoMock.Setup(r => r.GetByEmailAndConfirmationTokenAsync("confirm@example.com", "confirm-token"))
                .ReturnsAsync(customer);

            var result = await _service.ConfirmEmailAsync("confirm@example.com", "confirm-token");

            Assert.True(result);
            Assert.True(customer.EmailConfirmed);
            Assert.Null(customer.EmailConfirmationToken);
        }
    }
}
