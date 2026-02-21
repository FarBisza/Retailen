using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Retailen.Application.DTO.Return;
using Retailen.Application.Interfaces;
using Retailen.Application.Pagination;
using System.Security.Claims;

namespace Retailen.Presentation.Controllers
{
    [ApiController]
    [Route("api/return")]
    public class ReturnController : ControllerBase
    {
        private readonly IReturnService _returnService;

        public ReturnController(IReturnService returnService)
        {
            _returnService = returnService;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? int.Parse(claim.Value) : 0;
        }

        /// <summary>
        /// Get all returns (Admin/Staff only) — supports pagination via ?page=1&pageSize=20
        /// </summary>
        [HttpGet]
        [Authorize(Policy = "RequireStaff")]
        [ProducesResponseType(typeof(IEnumerable<ReturnDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll([FromQuery] int? page = null, [FromQuery] int? pageSize = null)
        {
            if (page.HasValue || pageSize.HasValue)
            {
                var pagination = new PaginationParams
                {
                    PageNumber = page ?? 1,
                    PageSize = pageSize ?? 10
                };
                var paged = await _returnService.GetAllPagedAsync(pagination);
                return Ok(paged);
            }
            var returns = await _returnService.GetAllAsync();
            return Ok(returns);
        }

        /// <summary>
        /// Get returns by status (Admin/Staff only)
        /// </summary>
        [HttpGet("status/{statusId:int}")]
        [Authorize(Policy = "RequireStaff")]
        [ProducesResponseType(typeof(IEnumerable<ReturnDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByStatus(int statusId)
        {
            var returns = await _returnService.GetByStatusAsync(statusId);
            return Ok(returns);
        }

        /// <summary>
        /// Get my returns (authenticated customer)
        /// </summary>
        [HttpGet("my")]
        [Authorize]
        [ProducesResponseType(typeof(IEnumerable<ReturnDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMyReturns()
        {
            var userId = GetCurrentUserId();
            var returns = await _returnService.GetByCustomerIdAsync(userId);
            return Ok(returns);
        }

        /// <summary>
        /// Get return by ID
        /// </summary>
        [HttpGet("{id:int}")]
        [Authorize]
        [ProducesResponseType(typeof(ReturnDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetById(int id)
        {
            var returnItem = await _returnService.GetByIdAsync(id);
            if (returnItem == null)
                return NotFound(new { message = "Return not found" });
            return Ok(returnItem);
        }

        /// <summary>
        /// Create return request (authenticated customer)
        /// </summary>
        [HttpPost]
        [Authorize]
        [ProducesResponseType(typeof(ReturnDTO), StatusCodes.Status201Created)]
        public async Task<IActionResult> Create([FromBody] CreateReturnRequestDTO request)
        {
            var userId = GetCurrentUserId();
            var returnItem = await _returnService.CreateAsync(userId, request);
            return CreatedAtAction(nameof(GetById), new { id = returnItem.ReturnId }, returnItem);
        }

        /// <summary>
        /// Update return status (Admin/Staff only)
        /// Statuses: 1=Pending, 2=Approved, 3=Rejected, 4=RefundCompleted, 5=Cancelled
        /// </summary>
        [HttpPut("{id:int}/status")]
        [Authorize(Policy = "RequireStaff")]
        [ProducesResponseType(typeof(ReturnDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateReturnStatusDTO request)
        {
            var returnItem = await _returnService.UpdateStatusAsync(id, request);
            return Ok(returnItem);
        }

        /// <summary>
        /// Cancel my return request (customer only, pending returns only)
        /// </summary>
        [HttpPost("{id:int}/cancel")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Cancel(int id)
        {
            var userId = GetCurrentUserId();
            await _returnService.CancelAsync(id, userId);
            return NoContent();
        }
    }
}