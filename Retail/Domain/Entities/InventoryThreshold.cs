using Retailen.Domain.Entities.Logistics;
using ProductEntity = Retailen.Domain.Entities.Product.Product;

namespace Retailen.Domain.Entities
{
    public class InventoryThreshold
    {
        public int ProductId { get; set; }
        public int WarehouseId { get; set; }
        public int LowStockThreshold { get; set; }

        // Navigation properties
        public virtual ProductEntity Product { get; set; } = null!;
        public virtual Warehouse Warehouse { get; set; } = null!;
    }
}
