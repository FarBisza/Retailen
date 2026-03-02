namespace Retailen.Domain.Exceptions
{
    /// <summary>
    /// Thrown when a requested entity is not found. Middleware maps this to HTTP 404.
    /// </summary>
    public class EntityNotFoundException : Exception
    {
        public string EntityName { get; }
        public object? EntityId { get; }

        public EntityNotFoundException(string entityName, object? id = null)
            : base(id != null
                ? $"{entityName} with ID {id} was not found"
                : $"{entityName} was not found")
        {
            EntityName = entityName;
            EntityId = id;
        }
    }
}
