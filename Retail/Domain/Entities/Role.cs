namespace Retailen.Domain.Entities
{
    public class Role
    {
        public int Id { get; set; }                       
        public string Name { get; set; } = string.Empty;  

        // Navigation properties
        public ICollection<Customer> Customers { get; set; } = new List<Customer>();
    }
}
