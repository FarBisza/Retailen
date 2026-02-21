namespace Retailen.Domain.Exceptions
{
    /// <summary>
    /// Thrown when a user attempts an operation they are not authorized for. Middleware maps to HTTP 403.
    /// </summary>
    public class AccessDeniedException : Exception
    {
        public AccessDeniedException(string? message = null)
            : base(message ?? "Access denied") { }
    }
}
