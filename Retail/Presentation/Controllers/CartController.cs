using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Retailen.Application.DTO.Cart;
using Retailen.Application.Interfaces;

namespace Retailen.Presentation.Controllers
{
    [Route("api/cart")]
    public class CartController : BaseApiController
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(CartDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCart()
        {
            var customerId = GetCurrentUserIdOrNull();
            var sessionId = GetSessionId();

            var cart = await _cartService.GetCartAsync(customerId, sessionId);
            return Ok(cart);
        }

        [HttpPost("add")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequestDTO request)
        {
            try
            {
                request.CustomerId = GetCurrentUserIdOrNull();
                request.SessionId = GetSessionId();
                await _cartService.AddToCartAsync(request);
                return Ok(new { message = "Product added to cart" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("merge")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> MergeCart([FromBody] MergeCartRequestDTO request)
        {
            var customerId = GetCurrentUserId();
            await _cartService.MergeCartAsync(customerId, request.SessionId);
            return Ok(new { message = "Carts merged successfully" });
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateQuantity([FromBody] UpdateQuantityRequestDTO request)
        {
            var customerId = GetCurrentUserIdOrNull();
            var sessionId = GetSessionId();
            await _cartService.UpdateQuantityAsync(request, customerId, sessionId);
            return Ok(new { message = "Quantity updated" });
        }

        [HttpDelete("{cartId}/item/{cartItemId}")]
        public async Task<IActionResult> RemoveFromCart(int cartId, int cartItemId)
        {
            var customerId = GetCurrentUserIdOrNull();
            var sessionId = GetSessionId();
            await _cartService.RemoveFromCartAsync(cartId, cartItemId, customerId, sessionId);
            return Ok(new { message = "Item removed from cart" });
        }

        [HttpDelete("{cartId}")]
        public async Task<IActionResult> ClearCart(int cartId)
        {
            var customerId = GetCurrentUserIdOrNull();
            var sessionId = GetSessionId();
            await _cartService.ClearCartAsync(cartId, customerId, sessionId);
            return Ok(new { message = "Cart cleared" });
        }

        private string GetSessionId()
        {
            if (Request.Headers.TryGetValue("X-Session-ID", out var headerValue))
            {
                return headerValue.ToString();
            }
            return string.Empty;
        }
    }
}