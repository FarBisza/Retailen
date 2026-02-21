using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Retailen.Application.DTO.Customer;
using Retailen.Application.Interfaces;
using Retailen.Application.Pagination;

namespace Retailen.Presentation.Controllers
{
    [Route("api/customer")]
    [Authorize]
    public class CustomerController : BaseApiController
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        /// <summary>
        /// Get current user's profile
        /// </summary>
        [HttpGet("me")]
        [ProducesResponseType(typeof(CustomerDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = GetCurrentUserId();
            var customer = await _customerService.GetCurrentUserAsync(userId);

            if (customer == null)
                return NotFound(new { message = "Profile not found" });

            return Ok(customer);
        }

        /// <summary>
        /// Update current user's profile
        /// </summary>
        [HttpPut("me")]
        [ProducesResponseType(typeof(CustomerDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateCurrentUser([FromBody] UpdateCustomerRequestDTO request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var customer = await _customerService.UpdateAsync(userId, request);
                return Ok(customer);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get customer by ID (Admin/Staff only)
        /// </summary>
        [HttpGet("{id:int}")]
        [Authorize(Policy = "RequireStaff")]
        [ProducesResponseType(typeof(CustomerDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetById(int id)
        {
            var customer = await _customerService.GetByIdAsync(id);

            if (customer == null)
                return NotFound(new { message = "Customer not found" });

            return Ok(customer);
        }

        /// <summary>
        /// Get all customers (Admin/Staff only) — supports pagination via ?skip=0&take=20
        /// </summary>
        [HttpGet]
        [Authorize(Policy = "RequireStaff")]
        [ProducesResponseType(typeof(IEnumerable<CustomerDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll([FromQuery] int? page = null, [FromQuery] int? pageSize = null)
        {
            if (page.HasValue || pageSize.HasValue)
            {
                var pagination = new PaginationParams
                {
                    PageNumber = page ?? 1,
                    PageSize = pageSize ?? 10
                };
                var paged = await _customerService.GetAllPagedAsync(pagination);
                return Ok(paged);
            }
            var customers = await _customerService.GetAllAsync();
            return Ok(customers);
        }

        /// <summary>
        /// Update customer by ID (Admin only)
        /// </summary>
        [HttpPut("{id:int}")]
        [Authorize(Policy = "RequireAdmin")]
        [ProducesResponseType(typeof(CustomerDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCustomerRequestDTO request)
        {
            try
            {
                var customer = await _customerService.UpdateAsync(id, request);
                return Ok(customer);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Delete customer (Admin only)
        /// </summary>
        [HttpDelete("{id:int}")]
        [Authorize(Policy = "RequireAdmin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _customerService.DeleteAsync(id);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Activate or deactivate a customer (soft-delete) — Admin/Staff only
        /// </summary>
        [HttpPost("{id:int}/set-active")]
        [Authorize(Policy = "RequireAdmin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> SetActive(int id, [FromBody] SetActiveRequestDTO request)
        {
            try
            {
                await _customerService.SetActiveAsync(id, request.IsActive);
                return Ok(new { message = request.IsActive ? "Customer activated" : "Customer deactivated" });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Assign a role to a customer — Admin only
        /// Role IDs: 1=Admin, 2=Customer, 3=Employee, 4=Supplier
        /// </summary>
        [HttpPost("{id:int}/set-role")]
        [Authorize(Policy = "RequireAdmin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> SetRole(int id, [FromBody] SetRoleRequestDTO request)
        {
            try
            {
                await _customerService.SetRoleAsync(id, request.RoleId);
                return Ok(new { message = "Role assigned successfully" });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}