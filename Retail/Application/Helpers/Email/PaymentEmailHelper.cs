namespace Retailen.Application.Helpers.Email
{
    public static class PaymentEmailHelper
    {
        public static (string Subject, string Body) GetPaymentConfirmationEmail(int orderId, decimal total)
        {
            var subject = $"Order #{orderId} Confirmed";
            var body = $@"
                <h1>Thank you for your order!</h1>
                <p>Your order <strong>#{orderId}</strong> has been successfully paid.</p>
                <p><strong>Total Amount:</strong> {total:C}</p>
                <p>We will notify you when it ships.</p>
                <br/>
                <p>RETAILEN Team</p>";

            return (subject, body);
        }
    }
}
