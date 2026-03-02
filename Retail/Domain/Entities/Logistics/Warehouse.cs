namespace Retailen.Domain.Entities.Logistics
{
    public class Warehouse
    {
        public int Id { get; set; }                       
        public string Name { get; set; } = default!;      
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public bool Active { get; set; } = true;          
    }
}