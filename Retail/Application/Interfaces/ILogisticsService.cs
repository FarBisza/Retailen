using Retailen.Application.DTO;
using Retailen.Application.DTO.Logistics;
using Retailen.Application.Pagination;

namespace Retailen.Application.Interfaces
{
    /// <summary>
    /// Unified logistics service for goods receipt (inbound) and shipments (outbound)
    /// </summary>
    public interface ILogisticsService
    {
        // ===== Suppliers =====
        Task<List<SupplierDTO>> GetSuppliersAsync();
        Task<SupplierDTO?> GetSupplierAsync(int id);
        Task<SupplierDTO> CreateSupplierAsync(CreateSupplierRequestDTO dto);
        Task<bool> UpdateSupplierAsync(int id, CreateSupplierRequestDTO dto);
        Task<bool> DeleteSupplierAsync(int id);

        // ===== Warehouses =====
        Task<List<WarehouseDTO>> GetWarehousesAsync();

        // ===== Purchase Orders =====
        Task<List<PurchaseOrderDTO>> GetPurchaseOrdersAsync();
        Task<PagedResult<PurchaseOrderDTO>> GetPurchaseOrdersPagedAsync(PaginationParams pagination);
        Task<PurchaseOrderDTO?> GetPurchaseOrderAsync(int id);
        Task<CreateSupplyOrderResponseDTO> CreatePurchaseOrderAsync(CreateSupplyOrderRequestDTO dto);
        Task<bool> UpdatePurchaseOrderStatusAsync(int id, int statusId);
        Task<bool> CancelPurchaseOrderAsync(int id);

        // ===== Supplier Portal =====
        Task<List<PurchaseOrderDTO>> GetOrdersForSupplierAsync(int supplierId);
        Task<bool> ConfirmOrderBySupplierAsync(int orderId, int supplierId);
        Task<bool> RejectOrderBySupplierAsync(int orderId, int supplierId, string? reason);

        // ===== Goods Receipt =====
        Task<List<GoodsReceiptDTO>> GetGoodsReceiptsAsync();
        Task<GoodsReceiptDTO?> GetGoodsReceiptAsync(int id);
        Task<ReceiveGoodsResponseDTO> CreateGoodsReceiptAsync(int purchaseOrderId, ReceiveGoodsRequestDTO dto);

        // ===== Customer Shipments =====
        Task<List<ShipmentDTO>> GetShipmentsAsync();
        Task<PagedResult<ShipmentDTO>> GetShipmentsPagedAsync(PaginationParams pagination);
        Task<ShipmentDTO?> GetShipmentAsync(int id);
        Task<List<ShipmentDTO>> GetShipmentsForOrderAsync(int orderId);
        Task<CreateShipmentResponseDTO> CreateShipmentAsync(int orderId, int warehouseId, CreateShipmentRequestDTO dto);
        Task<bool> MarkShippedAsync(int shipmentId, MarkShippedRequestDTO dto);
        Task<bool> MarkDeliveredAsync(int shipmentId, MarkDeliveredRequestDTO dto);
    }
}
