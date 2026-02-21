using Retailen.Domain.Entities.Logistics.Deliveries.DeliveryDictionary;
using Retailen.Domain.Enums;

namespace Retailen.Application.Helpers.Status
{
    public static class ShipmentStatusHelper
    {
        public static ShipmentStatusHistory CreateShipmentStatusChange(
            int shipmentId, ShipmentStatusEnum status, string comment)
        {
            return new ShipmentStatusHistory
            {
                ShipmentId = shipmentId,
                ShipmentStatusId = (int)status,
                ChangedAt = DateTime.UtcNow,
                Comment = comment
            };
        }
    }
}
