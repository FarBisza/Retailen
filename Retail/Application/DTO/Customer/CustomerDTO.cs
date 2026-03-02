namespace Retailen.Application.DTO.Customer
{
    public class CustomerDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? ZipCode { get; set; }
        public string? Country { get; set; }
        public bool IsActive { get; set; } = true;
        public int RoleId { get; set; }
        public string? Role { get; set; }
        public DateTime? RegisteredAt { get; set; }
    }
}