namespace Retailen.Application.DTO.Logistics
{
    public class ShipmentDTO
    {
        public int ShipmentId { get; set; }
        public int OrderId { get; set; }
        public int WarehouseId { get; set; }
        public string? WarehouseName { get; set; }
        public string? Carrier { get; set; }
        public string? ServiceLevel { get; set; }
        public string? TrackingNumber { get; set; }
        public DateTime? ShipDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public int? ShipmentStatusId { get; set; }
        public string? StatusName { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<ShipmentItemDTO> Items { get; set; } = new();
    }
}
