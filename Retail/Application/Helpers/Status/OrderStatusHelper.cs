using Retailen.Domain.Entities.History;
using Retailen.Domain.Enums;

namespace Retailen.Application.Helpers.Status
{
    public static class OrderStatusHelper
    {
        public static OrderStatusHistory CreateStatusChange(
            int orderId, OrderStatusEnum status, string comment)
        {
            return new OrderStatusHistory
            {
                OrderId = orderId,
                OrderStatusId = (int)status,
                ChangedAt = DateTime.UtcNow,
                Comment = comment
            };
        }
    }
}
