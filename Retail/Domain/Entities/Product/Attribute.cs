namespace Retailen.Domain.Entities.Product
{
    public class Attribute
    {
        public int Id { get; set; }                       
        public string Code { get; set; } = string.Empty;  
        public string Name { get; set; } = string.Empty;  
        public string DataType { get; set; } = string.Empty; 
        public string? Unit { get; set; }                  
    }
}
