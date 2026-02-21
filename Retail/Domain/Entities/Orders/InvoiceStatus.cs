namespace Retailen.Domain.Entities
{
    public class InvoiceStatus
    {
        public int Id { get; set; }                       
        public string Name { get; set; } = string.Empty;  
        public string? Description { get; set; }           
    }
}
