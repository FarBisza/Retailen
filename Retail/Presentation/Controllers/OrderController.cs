using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Retailen.Application.DTO;
using Retailen.Application.DTO.Order;
using Retailen.Application.Interfaces;
using Retailen.Application.Pagination;

namespace Retailen.Presentation.Controllers
{
    [Route("api/order")]
    [Authorize]
    public class OrderController : BaseApiController
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequestDTO request)
        {
            var userId = GetCurrentUserId();
            request.UserId = userId;

            var order = await _orderService.CreateOrderAsync(request);
            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var userId = GetCurrentUserId();
            var order = await _orderService.GetOrderByIdAsync(id, userId);

            if (order == null)
                return NotFound(new { message = "Order not found." });

            return Ok(order);
        }

        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = GetCurrentUserId();
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);
            return Ok(orders);
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] AddressDTO address)
        {
            var userId = GetCurrentUserId();
            var result = await _orderService.CheckoutAsync(userId, address);
            return Ok(result);
        }

        [HttpPost("{id:int}/pay")]
        public async Task<IActionResult> Pay(int id, [FromBody] PayRequestDTO request)
        {
            var userId = GetCurrentUserId();
            await _orderService.PayAsync(id, userId, request);
            return Ok(new { message = "Payment accepted" });
        }

        [HttpPost("{id:int}/request-invoice")]
        public async Task<IActionResult> RequestInvoice(int id, [FromBody] BillingInfoRequestDTO request)
        {
            var userId = GetCurrentUserId();
            await _orderService.RequestInvoiceAsync(id, userId, request);
            return Ok(new { message = "Invoice request accepted" });
        }

        [HttpGet("counts")]
        public async Task<IActionResult> GetOrderCounts()
        {
            var userId = GetCurrentUserId();
            var counts = await _orderService.GetOrderCountsAsync(userId);
            return Ok(counts);
        }

        [HttpGet("all")]
        [Authorize(Policy = "RequireStaff")]
        public async Task<IActionResult> GetAllOrders([FromQuery] int? page = null, [FromQuery] int? pageSize = null)
        {
            if (page.HasValue || pageSize.HasValue)
            {
                var pagination = new PaginationParams
                {
                    PageNumber = page ?? 1,
                    PageSize = pageSize ?? 10
                };
                var paged = await _orderService.GetAllOrdersPagedAsync(pagination);
                return Ok(paged);
            }
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpPost("{id:int}/ship")]
        [Authorize(Policy = "RequireStaff")]
        public async Task<IActionResult> ShipOrder(int id, [FromBody] ShipOrderRequestDTO request)
        {
            await _orderService.ShipOrderAsync(id, request.Carrier, request.TrackingNumber);
            return Ok(new { message = "Order shipped" });
        }

        [HttpGet("{id:int}/invoice")]
        public async Task<IActionResult> GetInvoice(int id)
        {
            var invoice = await _orderService.GetInvoiceByOrderIdAsync(id, GetCurrentUserId());
            if (invoice == null)
                return NotFound(new { message = "No invoice found for this order" });
            return Ok(invoice);
        }

        [HttpPost("{id:int}/deliver")]
        [Authorize(Policy = "RequireStaff")]
        public async Task<IActionResult> DeliverOrder(int id)
        {
            await _orderService.DeliverOrderAsync(id);
            return Ok(new { message = "Order delivered" });
        }

        [HttpPost("{id:int}/process")]
        [Authorize(Policy = "RequireStaff")]
        public async Task<IActionResult> StartProcessing(int id)
        {
            await _orderService.StartProcessingAsync(id);
            return Ok(new { message = "Order is now being processed" });
        }
    }
}