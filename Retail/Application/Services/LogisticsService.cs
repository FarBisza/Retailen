using Microsoft.EntityFrameworkCore;
using Retailen.Application.DTO;
using Retailen.Application.Pagination;
using Retailen.Application.Helpers;
using Retailen.Application.Helpers.Mapping;
using Retailen.Application.Helpers.Status;
using Retailen.Application.DTO.Logistics;
using Retailen.Application.Interfaces;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.History;
using Retailen.Domain.Entities.Logistics;
using Retailen.Domain.Entities.Logistics.Deliveries.Supplier;
using Retailen.Domain.Entities.Logistics.Deliveries.DeliveryDictionary;
using Retailen.Domain.Entities.Logistics.GoodsReceipt;
using Retailen.Domain.Enums;
using Retailen.Domain.Exceptions;
using Retailen.Domain.Interfaces;

namespace Retailen.Application.Services
{
    public class LogisticsService : ILogisticsService
    {
        private readonly IRepository<Supplier> _supplierRepository;
        private readonly IRepository<Warehouse> _warehouseRepository;
        private readonly IPurchaseOrderRepository _purchaseOrderRepository;
        private readonly IGoodsReceiptRepository _goodsReceiptRepository;
        private readonly IShipmentRepository _shipmentRepository;
        private readonly IInventoryService _inventoryService;
        private readonly IRepository<GoodsReceiptDiscrepancy> _receiptDiscrepancyRepository;
        private readonly IRepository<ShipmentStatusHistory> _shipmentStatusHistoryRepository;
        private readonly IRepository<InventoryThreshold> _thresholdRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IUnitOfWork _unitOfWork;

        public LogisticsService(
            IRepository<Supplier> supplierRepository,
            IRepository<Warehouse> warehouseRepository,
            IPurchaseOrderRepository purchaseOrderRepository,
            IGoodsReceiptRepository goodsReceiptRepository,
            IShipmentRepository shipmentRepository,
            IInventoryService inventoryService,
            IRepository<GoodsReceiptDiscrepancy> receiptDiscrepancyRepository,
            IRepository<ShipmentStatusHistory> shipmentStatusHistoryRepository,
            IRepository<InventoryThreshold> thresholdRepository,
            IOrderRepository orderRepository,
            IUnitOfWork unitOfWork)
        {
            _supplierRepository = supplierRepository;
            _warehouseRepository = warehouseRepository;
            _purchaseOrderRepository = purchaseOrderRepository;
            _goodsReceiptRepository = goodsReceiptRepository;
            _shipmentRepository = shipmentRepository;
            _inventoryService = inventoryService;
            _receiptDiscrepancyRepository = receiptDiscrepancyRepository;
            _shipmentStatusHistoryRepository = shipmentStatusHistoryRepository;
            _thresholdRepository = thresholdRepository;
            _orderRepository = orderRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<SupplierDTO>> GetSuppliersAsync()
        {
            var suppliers = await _supplierRepository.GetAllAsync();
            return suppliers
                .Select(s => new SupplierDTO
                {
                    SupplierId = s.Id,
                    Name = s.Name,
                    Email = s.Email,
                    Phone = s.Phone,
                    Active = s.Active
                })
                .ToList();
        }

        public async Task<SupplierDTO?> GetSupplierAsync(int id)
        {
            var s = await _supplierRepository.GetByIdAsync(id);
            return s == null ? null : new SupplierDTO
            {
                SupplierId = s.Id,
                Name = s.Name,
                Email = s.Email,
                Phone = s.Phone,
                Active = s.Active
            };
        }

        public async Task<SupplierDTO> CreateSupplierAsync(CreateSupplierRequestDTO dto)
        {
            var entity = new Supplier
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Active = true
            };
            await _supplierRepository.AddAsync(entity);
            await _supplierRepository.SaveChangesAsync();
            return new SupplierDTO
            {
                SupplierId = entity.Id,
                Name = entity.Name,
                Email = entity.Email,
                Phone = entity.Phone,
                Active = entity.Active
            };
        }

        public async Task<bool> UpdateSupplierAsync(int id, CreateSupplierRequestDTO dto)
        {
            var entity = await _supplierRepository.GetByIdAsync(id);
            if (entity == null) return false;

            entity.Name = dto.Name;
            entity.Email = dto.Email;
            entity.Phone = dto.Phone;
            await _supplierRepository.UpdateAsync(entity);
            await _supplierRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteSupplierAsync(int id)
        {
            var entity = await _supplierRepository.GetByIdAsync(id);
            if (entity == null) return false;
            entity.Active = false; 
            await _supplierRepository.UpdateAsync(entity);
            await _supplierRepository.SaveChangesAsync();
            return true;
        }

        public async Task<List<WarehouseDTO>> GetWarehousesAsync()
        {
            var warehouses = await _warehouseRepository.GetAllAsync();
            return warehouses
                .Where(w => w.Active)
                .Select(w => new WarehouseDTO
                {
                    WarehouseId = w.Id,
                    Name = w.Name,
                    Active = w.Active
                })
                .ToList();
        }

        public async Task<bool> SetInventoryThresholdAsync(UpdateInventoryThresholdDTO dto)
        {
            var existing = (await _thresholdRepository.FindAsync(t => t.ProductId == dto.ProductId && t.WarehouseId == dto.WarehouseId)).FirstOrDefault();

            if (existing != null)
            {
                if (dto.LowStockThreshold <= 0)
                {
                    // If threshold is 0 or less, we delete the rule to stop tracking
                    await _thresholdRepository.DeleteAsync(existing);
                }
                else
                {
                    existing.LowStockThreshold = dto.LowStockThreshold;
                    await _thresholdRepository.UpdateAsync(existing);
                }
            }
            else if (dto.LowStockThreshold > 0)
            {
                var newThreshold = new InventoryThreshold
                {
                    ProductId = dto.ProductId,
                    WarehouseId = dto.WarehouseId,
                    LowStockThreshold = dto.LowStockThreshold
                };
                await _thresholdRepository.AddAsync(newThreshold);
            }

            await _thresholdRepository.SaveChangesAsync();
            return true;
        }

        public async Task<List<PurchaseOrderDTO>> GetPurchaseOrdersAsync()
        {
            var orders = await _purchaseOrderRepository.GetAllWithDetailsAsync();
            return orders.Select(PurchaseOrderMappingHelper.MapToPurchaseOrderDTO).ToList();
        }

        public async Task<PagedResult<PurchaseOrderDTO>> GetPurchaseOrdersPagedAsync(PaginationParams pagination)
        {
            var (items, totalCount) = await _purchaseOrderRepository.GetAllPagedAsync(pagination.Skip, pagination.PageSize);
            return new PagedResult<PurchaseOrderDTO>
            {
                Items = items.Select(PurchaseOrderMappingHelper.MapToPurchaseOrderDTO).ToList(),
                TotalCount = totalCount
            };
        }

        public async Task<PurchaseOrderDTO?> GetPurchaseOrderAsync(int id)
        {
            var po = await _purchaseOrderRepository.GetByIdWithDetailsAsync(id);
            return po == null ? null : PurchaseOrderMappingHelper.MapToPurchaseOrderDTO(po);
        }

        public async Task<CreateSupplyOrderResponseDTO> CreatePurchaseOrderAsync(CreateSupplyOrderRequestDTO dto)
        {
            var entity = new PurchaseOrder
            {
                SupplierId = dto.SupplierId,
                WarehouseId = dto.WarehouseId,
                StatusId = (int)PurchaseOrderStatusEnum.Submitted,
                CreatedAt = DateTime.UtcNow,
                ExpectedDate = dto.ExpectedDate,
                Comment = dto.Comment
            };

            foreach (var line in dto.Items)
            {
                entity.Items.Add(new PurchaseOrderItem
                {
                    ProductId = line.ProductId,
                    QuantityOrdered = line.QuantityOrdered,
                    PurchasePrice = line.PurchasePrice
                });
            }

            await _purchaseOrderRepository.AddAsync(entity);
            await _purchaseOrderRepository.SaveChangesAsync();

            return new CreateSupplyOrderResponseDTO { SupplyOrderId = entity.Id };
        }

        public async Task<bool> UpdatePurchaseOrderStatusAsync(int id, int statusId)
        {
            var entity = await _purchaseOrderRepository.GetByIdAsync(id);
            if (entity == null) return false;
            entity.StatusId = statusId;
            await _purchaseOrderRepository.UpdateAsync(entity);
            await _purchaseOrderRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CancelPurchaseOrderAsync(int id)
        {
            return await UpdatePurchaseOrderStatusAsync(id, (int)PurchaseOrderStatusEnum.Cancelled); 
        }

        public async Task<List<PurchaseOrderDTO>> GetOrdersForSupplierAsync(int supplierId)
        {
            var orders = await _purchaseOrderRepository.GetBySupplierIdWithDetailsAsync(supplierId);
            return orders.Select(PurchaseOrderMappingHelper.MapToPurchaseOrderDTO).ToList();
        }

        public async Task<bool> ConfirmOrderBySupplierAsync(int orderId, int supplierId)
        {
            var po = await _purchaseOrderRepository.GetByIdAsync(orderId);
            if (po == null || po.SupplierId != supplierId) return false;
            
            po.StatusId = (int)PurchaseOrderStatusEnum.Confirmed;
            await _purchaseOrderRepository.UpdateAsync(po);
            await _purchaseOrderRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectOrderBySupplierAsync(int orderId, int supplierId, string? reason)
        {
            var po = await _purchaseOrderRepository.GetByIdAsync(orderId);
            if (po == null || po.SupplierId != supplierId) return false;
            
            po.StatusId = (int)PurchaseOrderStatusEnum.Cancelled;
            po.Comment = reason ?? "Rejected by supplier";
            await _purchaseOrderRepository.UpdateAsync(po);
            await _purchaseOrderRepository.SaveChangesAsync();
            return true;
        }

        public async Task<List<GoodsReceiptDTO>> GetGoodsReceiptsAsync()
        {
            var receipts = await _goodsReceiptRepository.GetAllWithDetailsAsync();
            return receipts.Select(GoodsReceiptMappingHelper.MapToGoodsReceiptDTO).ToList();
        }

        public async Task<GoodsReceiptDTO?> GetGoodsReceiptAsync(int id)
        {
            var gr = await _goodsReceiptRepository.GetByIdWithDetailsAsync(id);
            return gr == null ? null : GoodsReceiptMappingHelper.MapToGoodsReceiptDTO(gr);
        }

        public async Task<ReceiveGoodsResponseDTO> CreateGoodsReceiptAsync(int purchaseOrderId, ReceiveGoodsRequestDTO dto)
        {
            var po = await _purchaseOrderRepository.GetByIdWithDetailsAsync(purchaseOrderId);
            if (po == null) throw new ArgumentException("Purchase Order not found");

            var orderedLookup = po.Items.ToDictionary(i => i.ProductId, i => i.QuantityOrdered);

            bool hasDiscrepancy = false;

            foreach (var line in dto.Items)
            {
                if (!orderedLookup.TryGetValue(line.ProductId, out int quantityOrdered))
                    throw new ArgumentException($"Product {line.ProductId} is not part of this PO");

                if (line.QuantityReceived < 0 || line.QuantityDamaged < 0)
                    throw new ArgumentException($"Quantities cannot be negative (Product {line.ProductId})");

                if (line.QuantityReceived > quantityOrdered)
                    throw new ArgumentException(
                        $"Received ({line.QuantityReceived}) cannot exceed Ordered ({quantityOrdered}) for Product {line.ProductId}");

                if (line.QuantityDamaged > line.QuantityReceived)
                    throw new ArgumentException(
                        $"Damaged ({line.QuantityDamaged}) cannot exceed Received ({line.QuantityReceived}) for Product {line.ProductId}");

                int shortage = quantityOrdered - line.QuantityReceived;
                if (shortage > 0 || line.QuantityDamaged > 0)
                    hasDiscrepancy = true;
            }

            var receipt = new GoodsReceipt
            {
                PurchaseOrderId = purchaseOrderId,
                WarehouseId = dto.WarehouseId ?? po.WarehouseId,
                DocumentNumber = dto.DocumentNumber,
                ReceiptDate = DateTime.UtcNow,
                ShippingCost = dto.ShippingCost,
                Comment = dto.Comment
            };

            int warehouseId = dto.WarehouseId ?? po.WarehouseId ?? ServiceConstants.DefaultWarehouseId;

            foreach (var line in dto.Items)
            {
                receipt.Items.Add(new GoodsReceiptItem
                {
                    ProductId = line.ProductId,
                    QuantityReceived = line.QuantityReceived,
                    QuantityDamaged = line.QuantityDamaged
                });

                int sellableQuantity = line.QuantityReceived - line.QuantityDamaged;

                await _inventoryService.AddStockAsync(line.ProductId, sellableQuantity, warehouseId);
            }

            await _goodsReceiptRepository.AddAsync(receipt);
            await _goodsReceiptRepository.SaveChangesAsync();

            foreach (var line in dto.Items)
            {
                int quantityOrdered = orderedLookup[line.ProductId];
                int shortage = quantityOrdered - line.QuantityReceived;
                int damaged = line.QuantityDamaged;

                if (damaged > 0 && shortage > 0)
                {
                    await _receiptDiscrepancyRepository.AddAsync(new GoodsReceiptDiscrepancy
                    {
                        GoodsReceiptId = receipt.Id,
                        ProductId = line.ProductId,
                        Type = "Damaged+Shortage",
                        Quantity = damaged + shortage,
                        Description = $"Damaged: {damaged}, Shortage: {shortage}",
                        CreatedAt = DateTime.UtcNow
                    });
                }
                else if (damaged > 0)
                {
                    await _receiptDiscrepancyRepository.AddAsync(new GoodsReceiptDiscrepancy
                    {
                        GoodsReceiptId = receipt.Id,
                        ProductId = line.ProductId,
                        Type = "Damaged",
                        Quantity = damaged,
                        Description = "Damaged during transit",
                        CreatedAt = DateTime.UtcNow
                    });
                }
                else if (shortage > 0)
                {
                    await _receiptDiscrepancyRepository.AddAsync(new GoodsReceiptDiscrepancy
                    {
                        GoodsReceiptId = receipt.Id,
                        ProductId = line.ProductId,
                        Type = "Shortage",
                        Quantity = shortage,
                        Description = "Items not delivered",
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            po.StatusId = hasDiscrepancy
                ? (int)PurchaseOrderStatusEnum.PartiallyReceived
                : (int)PurchaseOrderStatusEnum.FullyReceived;
            await _purchaseOrderRepository.UpdateAsync(po);
            await _purchaseOrderRepository.SaveChangesAsync();

            return new ReceiveGoodsResponseDTO
            {
                GoodsReceiptId = receipt.Id,
                Message = hasDiscrepancy
                    ? "Goods receipt created with discrepancies (marked as Partially Received)"
                    : "Goods receipt created successfully (marked as Fully Received)"
            };
        }

        public async Task<List<ShipmentDTO>> GetShipmentsAsync()
        {
            var shipments = await _shipmentRepository.GetAllWithDetailsAsync();
            return shipments.Select(ShipmentMappingHelper.MapToShipmentDTO).ToList();
        }

        public async Task<PagedResult<ShipmentDTO>> GetShipmentsPagedAsync(PaginationParams pagination)
        {
            var (items, totalCount) = await _shipmentRepository.GetAllPagedAsync(pagination.Skip, pagination.PageSize);
            return new PagedResult<ShipmentDTO>
            {
                Items = items.Select(ShipmentMappingHelper.MapToShipmentDTO).ToList(),
                TotalCount = totalCount
            };
        }

        public async Task<ShipmentDTO?> GetShipmentAsync(int id)
        {
            var s = await _shipmentRepository.GetByIdWithDetailsAsync(id);
            return s == null ? null : ShipmentMappingHelper.MapToShipmentDTO(s);
        }

        public async Task<List<ShipmentDTO>> GetShipmentsForOrderAsync(int orderId)
        {
            var shipments = await _shipmentRepository.GetByOrderIdWithDetailsAsync(orderId);
            return shipments.Select(ShipmentMappingHelper.MapToShipmentDTO).ToList();
        }

        public async Task<CreateShipmentResponseDTO> CreateShipmentAsync(int orderId, int warehouseId, CreateShipmentRequestDTO dto)
        {
            var shipment = new Shipment
            {
                OrderId = orderId,
                WarehouseId = warehouseId,
                Carrier = dto.Carrier,
                ServiceLevel = dto.ServiceLevel,
                TrackingNumber = dto.TrackingNumber,
                ShipmentStatusId = (int)ShipmentStatusEnum.Created,
                CreatedAt = DateTime.UtcNow
            };

            foreach (var line in dto.Items)
            {
                shipment.Items.Add(new ShipmentItem
                {
                    OrderItemId = line.OrderItemId,
                    Quantity = line.Quantity
                });
            }

            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                await _shipmentRepository.AddAsync(shipment);
                await _shipmentRepository.SaveChangesAsync();

                await _shipmentStatusHistoryRepository.AddAsync(
                    ShipmentStatusHelper.CreateShipmentStatusChange(shipment.Id, ShipmentStatusEnum.Created, "Shipment created"));

                var order = await _orderRepository.GetByIdAsync(orderId);
                if (order != null && order.OrderStatusId == (int)OrderStatusEnum.Paid)
                {
                    order.OrderStatusId = (int)OrderStatusEnum.Processing;
                    await _orderRepository.UpdateAsync(order);
                }

                await _shipmentRepository.SaveChangesAsync();
            });

            return new CreateShipmentResponseDTO { ShipmentId = shipment.Id };
        }

        public async Task<bool> MarkShippedAsync(int shipmentId, MarkShippedRequestDTO dto)
        {
            var s = await _shipmentRepository.GetByIdAsync(shipmentId);
            if (s == null) return false;

            s.ShipmentStatusId = (int)ShipmentStatusEnum.Shipped;
            s.ShipDate = dto.ShippedDate ?? DateTime.UtcNow;
            s.TrackingNumber = dto.TrackingNumber ?? s.TrackingNumber;

            await _shipmentRepository.UpdateAsync(s);

            await _shipmentStatusHistoryRepository.AddAsync(
                ShipmentStatusHelper.CreateShipmentStatusChange(shipmentId, ShipmentStatusEnum.Shipped, "Marked as shipped"));

            var order = await _orderRepository.GetByIdAsync(s.OrderId);
            if (order != null)
            {
                order.OrderStatusId = (int)OrderStatusEnum.Shipped;
                await _orderRepository.UpdateAsync(order);
            }

            await _shipmentRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MarkDeliveredAsync(int shipmentId, MarkDeliveredRequestDTO dto)
        {
            var s = await _shipmentRepository.GetByIdAsync(shipmentId);
            if (s == null) return false;

            s.ShipmentStatusId = (int)ShipmentStatusEnum.Delivered;
            s.DeliveryDate = dto.DeliveredDate ?? DateTime.UtcNow;

            await _shipmentRepository.UpdateAsync(s);

            await _shipmentStatusHistoryRepository.AddAsync(
                ShipmentStatusHelper.CreateShipmentStatusChange(shipmentId, ShipmentStatusEnum.Delivered, "Delivered"));

            var order = await _orderRepository.GetByIdAsync(s.OrderId);
            if (order != null)
            {
                order.OrderStatusId = (int)OrderStatusEnum.Delivered;
                await _orderRepository.UpdateAsync(order);
            }

            await _shipmentRepository.SaveChangesAsync();
            return true;
        }
    }
}