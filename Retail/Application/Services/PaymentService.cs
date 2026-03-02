using Retailen.Application.Helpers;
using Retailen.Application.Interfaces;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.History;
using Retailen.Domain.Enums;
using Retailen.Domain.Interfaces;

namespace Retailen.Application.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IOrderRepository _orderRepo;
        private readonly IInvoiceRepository _invoiceRepo;
        private readonly IInventoryRepository _inventoryRepo;
        private readonly IRepository<Payment> _paymentRepo;
        private readonly IRepository<InventoryHistory> _warehouseHistoryRepo;
        private readonly IProductService _productService;

        public PaymentService(
            IOrderRepository orderRepo,
            IInvoiceRepository invoiceRepo,
            IInventoryRepository inventoryRepo,
            IRepository<Payment> paymentRepo,
            IRepository<InventoryHistory> warehouseHistoryRepo,
            IProductService productService)
        {
            _orderRepo = orderRepo;
            _invoiceRepo = invoiceRepo;
            _inventoryRepo = inventoryRepo;
            _paymentRepo = paymentRepo;
            _warehouseHistoryRepo = warehouseHistoryRepo;
            _productService = productService;
        }

        public async Task<Invoice> GenerateInvoiceAsync(int orderId)
        {
            var order = await _orderRepo.GetByIdWithDetailsAsync(orderId);

            if (order == null)
                throw new ArgumentException("Order does not exist.");

            if (order.Invoices.Any())
                throw new InvalidOperationException("An invoice for this order already exists.");

            var invoice = new Invoice
            {
                OrderId = orderId,
                InvoiceStatusId = (int)InvoiceStatusEnum.Pending,
                IssuedDate = DateTime.UtcNow,
                Amount = order.Total
            };

            await _invoiceRepo.AddAsync(invoice);
            await _invoiceRepo.SaveChangesAsync();

            return invoice;
        }

        public async Task<Payment> RegisterPaymentAsync(int invoiceId, decimal amount, int paymentTypeId)
        {
            var invoice = await _invoiceRepo.GetByIdWithOrderDetailsAsync(invoiceId);

            if (invoice == null)
                throw new ArgumentException("Invoice does not exist.");

            if (invoice.InvoiceStatusId == (int)InvoiceStatusEnum.Paid)
                throw new InvalidOperationException("Invoice is already paid.");

            foreach (var item in invoice.Order.Items)
            {
                if (item.Product == null) continue;

                var warehouseId = ServiceConstants.DefaultWarehouseId;

                var inventory = await _inventoryRepo.GetByProductAndWarehouseAsync(item.ProductId, warehouseId);

                if (inventory == null || inventory.Quantity < item.Quantity)
                {
                    throw new InvalidOperationException($"Payment rejected: Insufficient stock for product '{item.Product.Name}' in warehouse.");
                }

                inventory.Quantity -= item.Quantity;
                inventory.UpdatedAt = DateTime.UtcNow;

                await _warehouseHistoryRepo.AddAsync(new InventoryHistory
                {
                    ProductId = item.ProductId,
                    WarehouseId = warehouseId,
                    OrderId = invoice.OrderId,
                    EventType = "INVOICE_PAID",
                    QuantityChange = -item.Quantity,
                    QuantityBefore = inventory.Quantity + item.Quantity,
                    QuantityAfter = inventory.Quantity,
                    CreatedAt = DateTime.UtcNow
                });
            }

            var payment = new Payment
            {
                InvoiceId = invoiceId,
                PaymentTypeId = paymentTypeId,
                Amount = amount,
                PaymentDate = DateTime.UtcNow
            };

            await _paymentRepo.AddAsync(payment);

            if (amount >= invoice.Amount)
            {
                invoice.InvoiceStatusId = (int)InvoiceStatusEnum.Paid;
                invoice.Order.OrderStatusId = (int)OrderStatusEnum.Paid;
            }

            await _paymentRepo.SaveChangesAsync();

            return payment;
        }
    }
}