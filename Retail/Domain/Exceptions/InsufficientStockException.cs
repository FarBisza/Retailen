namespace Retailen.Domain.Exceptions
{
    /// <summary>
    /// Thrown when there is not enough stock for the requested operation.
    /// </summary>
    public class InsufficientStockException : BusinessRuleException
    {
        public int ProductId { get; }
        public int Available { get; }
        public int Requested { get; }

        public InsufficientStockException(int productId, int available, int requested)
            : base($"Insufficient stock for product ID {productId}. Available: {available}, Required: {requested}")
        {
            ProductId = productId;
            Available = available;
            Requested = requested;
        }
    }
}
