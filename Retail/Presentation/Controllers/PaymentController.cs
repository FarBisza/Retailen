using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Retailen.Application.DTO.Payment;
using Retailen.Application.Interfaces;

namespace Retailen.Presentation.Controllers
{
    [ApiController]
    [Route("api/payment")]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("invoice/{orderId}")]
        public async Task<IActionResult> GenerateInvoice(int orderId)
        {
            try
            {
                var invoice = await _paymentService.GenerateInvoiceAsync(orderId);
                return Ok(new { invoiceId = invoice.Id, amount = invoice.Amount, status = "Issued" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPost("pay")]
        public async Task<IActionResult> PayInvoice([FromBody] PayInvoiceRequestDTO request)
        {
            try
            {
                var payment = await _paymentService.RegisterPaymentAsync(
                    request.InvoiceId, request.Amount, request.PaymentTypeId);
                return Ok(new { message = "Payment accepted.", paymentId = payment.Id });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }
    }
}