using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Retailen.Domain;

namespace Retailen.Presentation.Controllers
{
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {

        protected int GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                     ?? User.FindFirst("sub")?.Value;

            if (!int.TryParse(claim, out var id))
                throw new UnauthorizedAccessException("User ID not found in token");

            return id;
        }

        protected int? GetCurrentUserIdOrNull()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                     ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out var id))
                return null;

            return id;
        }

        protected string? GetCurrentUserRole()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value
                ?? User.FindFirst("role")?.Value;
        }

        protected bool IsAdmin()
        {
            return RoleMapper.IsAdmin(GetCurrentUserRole());
        }
    }
}