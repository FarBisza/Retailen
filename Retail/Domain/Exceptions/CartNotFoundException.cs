namespace Retailen.Domain.Exceptions
{
    public class CartNotFoundException : Exception
    {
        public CartNotFoundException(int cartId) 
            : base($"Cart with ID {cartId} was not found")
        {
        }
    }
}
