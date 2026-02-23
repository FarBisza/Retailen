using Retailen.Application.Interfaces;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.History;
using Retailen.Domain.Exceptions;
using Retailen.Domain.Interfaces;

namespace Retailen.Application.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly IInventoryRepository _inventoryRepository;
        private readonly IRepository<InventoryHistory> _historyRepository;

        public InventoryService(
            IInventoryRepository inventoryRepository,
            IRepository<InventoryHistory> historyRepository)
        {
            _inventoryRepository = inventoryRepository;
            _historyRepository = historyRepository;
        }

        public async Task DeductStockAsync(int productId, int quantity, int orderId)
        {
            var allInventory = await _inventoryRepository.FindAsync(i => i.ProductId == productId);
            var inventoryList = allInventory.ToList();

            var totalStock = inventoryList.Sum(i => i.Quantity);
            if (totalStock < quantity)
                throw new InsufficientStockException(productId, totalStock, quantity);

            var sortedInventory = inventoryList.OrderByDescending(i => i.Quantity).ToList();
            var remainingToDeduct = quantity;

            foreach (var inv in sortedInventory)
            {
                if (remainingToDeduct <= 0) break;
                if (inv.Quantity <= 0) continue;

                var deductAmount = Math.Min(inv.Quantity, remainingToDeduct);
                var before = inv.Quantity;
                
                inv.Quantity -= deductAmount;
                inv.UpdatedAt = DateTime.UtcNow;
                remainingToDeduct -= deductAmount;

                await _inventoryRepository.UpdateAsync(inv);

                await _historyRepository.AddAsync(new InventoryHistory
                {
                    ProductId = productId,
                    WarehouseId = inv.WarehouseId,
                    OrderId = orderId,
                    EventType = "ORDER_PAID",
                    QuantityChange = -deductAmount,
                    QuantityBefore = before,
                    QuantityAfter = inv.Quantity,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        public async Task RestoreStockAsync(int productId, int quantity, int orderId)
        {
            var allInventory = await _inventoryRepository.FindAsync(i => i.ProductId == productId);
            var inventory = allInventory.OrderByDescending(i => i.Quantity).FirstOrDefault();

            if (inventory == null) return;

            var before = inventory.Quantity;
            inventory.Quantity += quantity;
            inventory.UpdatedAt = DateTime.UtcNow;

            await _inventoryRepository.UpdateAsync(inventory);

            await _historyRepository.AddAsync(new InventoryHistory
            {
                ProductId = productId,
                WarehouseId = inventory.WarehouseId,
                OrderId = orderId,
                EventType = "RETURN",
                QuantityChange = quantity,
                QuantityBefore = before,
                QuantityAfter = inventory.Quantity,
                CreatedAt = DateTime.UtcNow
            });
        }

        public async Task AddStockAsync(int productId, int quantity, int warehouseId)
        {
            var existing = await _inventoryRepository.GetByProductAndWarehouseAsync(productId, warehouseId);

            if (existing != null)
            {
                var before = existing.Quantity;
                existing.Quantity += quantity;
                existing.UpdatedAt = DateTime.UtcNow;
                await _inventoryRepository.UpdateAsync(existing);

                await _historyRepository.AddAsync(new InventoryHistory
                {
                    ProductId = productId,
                    WarehouseId = warehouseId,
                    EventType = "GR",
                    QuantityChange = quantity,
                    QuantityBefore = before,
                    QuantityAfter = existing.Quantity,
                    CreatedAt = DateTime.UtcNow
                });
            }
            else
            {
                await _inventoryRepository.AddAsync(new Inventory
                {
                    ProductId = productId,
                    WarehouseId = warehouseId,
                    Quantity = quantity,
                    UpdatedAt = DateTime.UtcNow
                });

                await _historyRepository.AddAsync(new InventoryHistory
                {
                    ProductId = productId,
                    WarehouseId = warehouseId,
                    EventType = "GR",
                    QuantityChange = quantity,
                    QuantityBefore = 0,
                    QuantityAfter = quantity,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        public async Task<int> GetTotalStockAsync(int productId)
        {
            var inventoryItems = await _inventoryRepository.FindAsync(i => i.ProductId == productId);
            return inventoryItems.Sum(i => i.Quantity);
        }
    }
}
