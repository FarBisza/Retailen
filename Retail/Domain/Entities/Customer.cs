namespace Retailen.Domain.Entities
{
    public class Customer : BaseEntity
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }           
        public string? LastName { get; set; }             
        public string? Email { get; set; }
        public string? HashedPassword { get; set; }       
        public string? Phone { get; set; }                
        
        public bool EmailConfirmed { get; set; } = false;
        public string? EmailConfirmationToken { get; set; }

        public string? Address { get; set; }              
        public string? City { get; set; }                 
        public string? ZipCode { get; set; }              
        public string? Country { get; set; }              

        public string? PasswordResetToken { get; set; }
        public DateTime? ResetTokenExpires { get; set; }

        public bool Active { get; set; } = true;          
        public int RoleId { get; set; } = 2;              

        // Navigation properties
        public Role Role { get; set; } = null!;
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}