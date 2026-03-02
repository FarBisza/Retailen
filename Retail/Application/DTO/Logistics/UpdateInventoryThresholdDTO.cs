using System.Collections.Generic;

namespace Retailen.Application.DTO.Logistics
{
    public class UpdateInventoryThresholdDTO
    {
        public int ProductId { get; set; }
        public int WarehouseId { get; set; }
        public int LowStockThreshold { get; set; }
    }
}
