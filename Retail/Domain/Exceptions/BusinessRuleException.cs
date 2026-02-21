namespace Retailen.Domain.Exceptions
{
    /// <summary>
    /// Base exception for domain/business rule violations. Middleware maps this to HTTP 400.
    /// </summary>
    public class BusinessRuleException : Exception
    {
        public BusinessRuleException(string message) : base(message) { }
        public BusinessRuleException(string message, Exception inner) : base(message, inner) { }
    }
}
