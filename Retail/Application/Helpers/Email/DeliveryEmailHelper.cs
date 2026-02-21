namespace Retailen.Application.Helpers.Email
{
    public static class DeliveryEmailHelper
    {
        public static (string Subject, string Body) GetDeliveryConfirmationEmail(int orderId)
        {
            var subject = $"Order #{orderId} Delivered";
            var body = $@"
                <h1>Your Order Has Arrived!</h1>
                <p>Good news! Your order <strong>#{orderId}</strong> has been marked as delivered.</p>
                <p>We hope you enjoy your purchase.</p>
                <p>Please log in to your account to leave a review.</p>
                <br/>
                <p>Belo Fur Team</p>";

            return (subject, body);
        }
    }
}
