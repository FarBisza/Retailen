namespace Retailen.Domain.Entities
{
    public class RefreshToken : BaseEntity
    {
        public Guid Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public int CustomerId { get; set; }               
        public DateTime Expires { get; set; }
        public string CreatedByIp { get; set; } = string.Empty;
        public DateTime? Revoked { get; set; }
        public string? RevokedByIp { get; set; }
        public string? ReplacedByToken { get; set; }
        public string? ReasonRevoked { get; set; }

        // Navigation properties
        public Customer Customer { get; set; } = null!;

        // Helpers
        public bool IsExpired => DateTime.UtcNow >= Expires;
        public bool IsRevoked => Revoked != null;
        public bool IsActive => !IsRevoked && !IsExpired;
    }
}