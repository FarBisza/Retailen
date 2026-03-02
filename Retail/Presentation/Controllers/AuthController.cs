using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Retailen.Application.DTO;
using Retailen.Application.DTO.Auth;
using Retailen.Application.Interfaces;
using Retailen.Domain.Exceptions;

namespace Retailen.Presentation.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ICartService _cartService;

        public AuthController(IAuthService authService, ICartService cartService)
        {
            _authService = authService;
            _cartService = cartService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthenticateRequestDTO request)
        {
            try
            {
                var response = await _authService.AuthenticateAsync(request, GenerateIpAddress());
                SetTokenCookie(response.RefreshToken);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (AccessDeniedException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO request)
        {
            try
            {
                var response = await _authService.RegisterAsync(request);
                return CreatedAtAction(nameof(Register), response);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] string token, [FromQuery] string email)
        {
            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(email))
            {
                return BadRequest(new { message = "Token and email are required" });
            }

            var result = await _authService.ConfirmEmailAsync(email, token);

            if (result)
            {
                return Ok(new { message = "Email confirmed successfully" });
            }

            return BadRequest(new { message = "Invalid token or email" });
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["RefreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
            {
                return BadRequest(new { message = "No refresh token found in cookies" });
            }

            try
            {
                var response = await _authService.RefreshTokenAsync(refreshToken, GenerateIpAddress());
                SetTokenCookie(response.RefreshToken);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (AccessDeniedException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
            }
        }

        [HttpPost("revoke-token")]
        [Authorize]
        public async Task<IActionResult> RevokeToken([FromBody] RevokeTokenRequestDTO request)
        {
            var token = request.RefreshToken ?? Request.Cookies["RefreshToken"];

            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token is required" });

            try
            {
                await _authService.RevokeTokenAsync(token, GenerateIpAddress());
                return Ok(new { message = "Token revoked" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["RefreshToken"];
            if (!string.IsNullOrEmpty(refreshToken))
            {
                try
                {
                    await _authService.RevokeTokenAsync(refreshToken, GenerateIpAddress());
                }
                catch
                {
                   return BadRequest(new { message = "Token is required" });
                }
            }

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true
            };
            cookieOptions.Extensions.Add("Partitioned");

            Response.Cookies.Delete("RefreshToken", cookieOptions);

            return Ok(new { message = "Logged out successfully" });
        }

        [Authorize]
        [HttpGet("verify")]
        public IActionResult VerifyAccess()
        {
            return Ok(new
            {
                message = "You have access to an authorized service",
                User = User.Identity?.Name
            });
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public IActionResult VerifyAdminAccess()
        {
            return Ok("You have access to an admin-authorized service");
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDTO request)
        {
            await _authService.ForgotPasswordAsync(request);
            return Ok(new { message = "If the email exists, a reset link has been sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDTO request)
        {
            var result = await _authService.ResetPasswordAsync(request);
            if (!result)
            {
                return BadRequest(new { message = "Invalid token or email." });
            }
            return Ok(new { message = "Password has been reset successfully." });
        }

        private void SetTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7),
                SameSite = SameSiteMode.None,
                Secure = true
            };

            if (HttpContext.Request.Host.Host.Contains("localhost"))
            {
                cookieOptions.Extensions.Add("Partitioned");
            }

            Response.Cookies.Append("RefreshToken", token, cookieOptions);
        }

        private string GenerateIpAddress()
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"]!;
            else
                return HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString() ?? "0.0.0.0";
        }
    }
}