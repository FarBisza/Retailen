namespace Retailen.Domain.Exceptions
{
    public class EmptyCartException : Exception
    {
        public EmptyCartException() 
            : base("Cannot place an order from an empty cart")
        {
        }
    }
}
