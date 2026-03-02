using Retailen.Application.DTO.Logistics;
using Retailen.Domain.Entities;

namespace Retailen.Application.Helpers.Mapping
{
    public static class ShipmentMappingHelper
    {
        public static ShipmentDTO MapToShipmentDTO(Shipment s)
        {
            return new ShipmentDTO
            {
                ShipmentId = s.Id,
                OrderId = s.OrderId,
                WarehouseId = s.WarehouseId,
                WarehouseName = s.Warehouse?.Name,
                Carrier = s.Carrier,
                ServiceLevel = s.ServiceLevel,
                TrackingNumber = s.TrackingNumber,
                ShipDate = s.ShipDate,
                DeliveryDate = s.DeliveryDate,
                ShipmentStatusId = s.ShipmentStatusId,
                StatusName = s.Status?.Name,
                CreatedAt = s.CreatedAt,
                Items = s.Items.Select(i => new ShipmentItemDTO
                {
                    OrderItemId = i.OrderItemId,
                    ProductId = i.OrderItem?.ProductId ?? 0,
                    ProductName = i.OrderItem?.Product?.Name ?? $"Item #{i.OrderItemId}",
                    Quantity = i.Quantity
                }).ToList()
            };
        }
    }
}
