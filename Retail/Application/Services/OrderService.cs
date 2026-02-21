using AutoMapper;
using Retailen.Application.Helpers;
using Retailen.Application.Helpers.Email;
using Retailen.Application.Helpers.Status;
using Retailen.Application.DTO;
using Retailen.Application.DTO.Order;
using Retailen.Application.Pagination;
using Retailen.Application.Interfaces;
using Retailen.Domain.Entities.Product;
using Retailen.Domain.Entities;
using Retailen.Domain.Entities.Cart;
using Retailen.Domain.Entities.History;
using Retailen.Domain.Entities.Logistics;
using Retailen.Domain.Entities.Logistics.Deliveries.DeliveryDictionary;
using Retailen.Domain.Enums;
using Retailen.Domain.Exceptions;
using Retailen.Domain.Interfaces;

namespace Retailen.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICartService _cartService;
        private readonly IOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;
        private readonly IInventoryService _inventoryService;
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IRepository<Payment> _paymentRepository;
        private readonly IRepository<Shipment> _shipmentRepository;
        private readonly IRepository<ShipmentItem> _shipmentItemRepository;
        private readonly IRepository<ShipmentStatusHistory> _shipmentStatusHistoryRepository;
        private readonly IRepository<OrderStatusHistory> _orderStatusHistoryRepository;
        private readonly IRepository<OrderBillingInfo> _billingDataRepository;
        private readonly IRepository<Return> _returnRepository;
        private readonly IRepository<Review> _reviewRepository;
        private readonly IEmailService _emailService;

        public OrderService(
            IUnitOfWork unitOfWork, 
            IMapper mapper, 
            ICartService cartService,
            IOrderRepository orderRepository,
            ICartRepository cartRepository,
            IInventoryService inventoryService,
            IInvoiceRepository invoiceRepository,
            IRepository<Payment> paymentRepository,
            IRepository<Shipment> shipmentRepository,
            IRepository<ShipmentItem> shipmentItemRepository,
            IRepository<ShipmentStatusHistory> shipmentStatusHistoryRepository,
            IRepository<OrderStatusHistory> orderStatusHistoryRepository,
            IRepository<OrderBillingInfo> billingDataRepository,
            IRepository<Return> returnRepository,
            IRepository<Review> reviewRepository,
            IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _cartService = cartService;
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
            _inventoryService = inventoryService;
            _invoiceRepository = invoiceRepository;
            _paymentRepository = paymentRepository;
            _shipmentRepository = shipmentRepository;
            _shipmentItemRepository = shipmentItemRepository;
            _shipmentStatusHistoryRepository = shipmentStatusHistoryRepository;
            _orderStatusHistoryRepository = orderStatusHistoryRepository;
            _billingDataRepository = billingDataRepository;
            _returnRepository = returnRepository;
            _reviewRepository = reviewRepository;
            _emailService = emailService;
        }

        public async Task<OrderDTO> CreateOrderAsync(CreateOrderRequestDTO request)
        {
            var cart = await _cartRepository.GetCartWithItemsAsync(request.CartId);

            if (cart == null || !cart.Items.Any())
                throw new BusinessRuleException("Cart is empty or does not exist.");

            if (cart.CustomerId != request.UserId)
                throw new UnauthorizedAccessException("Cart does not belong to the user.");

            var order = new Order
            {
                CustomerId = request.UserId,
                OrderStatusId = (int)OrderStatusEnum.AwaitingPayment,
                OrderDate = DateTime.UtcNow,
                Total = 0
            };

            if (request.ShippingAddress != null)
            {
                order.ShippingAddress = new OrderShippingAddress
                {
                    FullName = request.ShippingAddress.FullName,
                    Email = request.ShippingAddress.Email ?? "",
                    PhoneNumber = request.ShippingAddress.PhoneNumber,
                    StreetAddress = request.ShippingAddress.StreetAddress,
                    City = request.ShippingAddress.City,
                    ZipCode = request.ShippingAddress.ZipCode,
                    Country = request.ShippingAddress.Country,
                    CreatedAt = DateTime.UtcNow
                };
            }
            else
            {
            }

            decimal total = 0;

            foreach (var item in cart.Items)
            {
                if (item.Product == null) continue;
                if (item.Product.Active != true)
                    throw new InvalidOperationException($"Product {item.Product.Name} is not active.");

                var orderItem = new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.Product.Price,
                    Order = order
                };

                order.Items.Add(orderItem);
                total += orderItem.UnitPrice * orderItem.Quantity;
            }

            order.Total = total;

            await _orderRepository.AddAsync(order);

            cart.Deactivate();
            await _cartRepository.UpdateAsync(cart);

            await _orderRepository.SaveChangesAsync();

            return _mapper.Map<OrderDTO>(order);
        }

        public async Task<OrderDTO?> GetOrderByIdAsync(int orderId, int userId)
        {
            var order = await _orderRepository.GetByIdWithDetailsAsync(orderId, userId);

            if (order == null) return null;

            return _mapper.Map<OrderDTO>(order);
        }

        public async Task<IEnumerable<OrderDTO>> GetOrdersByUserIdAsync(int userId)
        {
            var orders = await _orderRepository.GetOrdersByUserIdWithDetailsAsync(userId);
            return _mapper.Map<IEnumerable<OrderDTO>>(orders);
        }

        public async Task<CheckoutResponseDTO> CheckoutAsync(int customerId, AddressDTO address)
        {
            var cart = await _cartRepository.GetActiveCartByCustomerAsync(customerId);

            if (cart == null || cart.Items.Count == 0)
                throw new InvalidOperationException("Cart is empty");

            foreach (var item in cart.Items)
            {
                if (item.Product == null)
                    throw new InvalidOperationException($"Product {item.ProductId} not found");
                if (item.Product.Active != true)
                    throw new InvalidOperationException($"Product '{item.Product.Name}' is no longer available");

                var totalStock = await _inventoryService.GetTotalStockAsync(item.ProductId);
                if (totalStock < item.Quantity)
                    throw new InsufficientStockException(item.ProductId, totalStock, item.Quantity);
            }

            var statusNew = (int)OrderStatusEnum.AwaitingPayment;

            var order = new Order
            {
                CustomerId = customerId,
                OrderStatusId = statusNew,
                OrderDate = DateTime.UtcNow,
                Total = cart.Items.Sum(i => i.Quantity * i.Product!.Price)
            };

            foreach (var item in cart.Items)
            {
                order.Items.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.Product!.Price
                });
            }

            order.ShippingAddress = new OrderShippingAddress
            {
                Email = address.Email,
                FullName = address.FullName,
                PhoneNumber = address.PhoneNumber,
                StreetAddress = address.StreetAddress,
                Apartment = address.Apartment,
                City = address.City,
                State = address.State,
                ZipCode = address.ZipCode,
                Country = address.Country,
                CreatedAt = DateTime.UtcNow
            };

            order.Total = order.Items.Sum(x => x.Quantity * x.UnitPrice);

            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                await _orderRepository.AddAsync(order);
                await _orderRepository.SaveChangesAsync(); // To get ID

                await _orderStatusHistoryRepository.AddAsync(
                    OrderStatusHelper.CreateStatusChange(order.Id, OrderStatusEnum.AwaitingPayment, "Checkout created"));
                await _orderStatusHistoryRepository.SaveChangesAsync();

                cart.Deactivate();
                await _cartRepository.UpdateAsync(cart);
                await _cartRepository.SaveChangesAsync();
            });

            return new CheckoutResponseDTO { OrderId = order.Id, Total = order.Total };
        }

        public async Task PayAsync(int orderId, int customerId, PayRequestDTO request)
        {
            var order = await _orderRepository.GetByIdWithDetailsAsync(orderId, customerId);

            if (order == null) throw new EntityNotFoundException("Order", orderId);
            if (order.CustomerId != customerId) throw new AccessDeniedException();

            var statusNew = (int)OrderStatusEnum.AwaitingPayment;
            var statusPaid = (int)OrderStatusEnum.Paid;

            if (order.OrderStatusId != statusNew)
                throw new BusinessRuleException("Order is not in awaiting payment status");

            if (order.Total != request.Amount)
                throw new BusinessRuleException("Payment amount does not match order total");

            var recipientEmail = order.ShippingAddress?.Email;

            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                foreach (var line in order.Items)
                {
                    await _inventoryService.DeductStockAsync(line.ProductId, line.Quantity, order.Id);
                }

                order.OrderStatusEntity = null!;
                order.Items = null!;
                order.ShippingAddress = null!;
                order.Shipments = null!;

                order.OrderStatusId = statusPaid;
                await _orderRepository.UpdateAsync(order);

                await _orderStatusHistoryRepository.AddAsync(
                    OrderStatusHelper.CreateStatusChange(order.Id, OrderStatusEnum.Paid, "Order paid"));

                await _paymentRepository.AddAsync(new Payment
                {
                    PaymentTypeId = request.PaymentTypeId,
                    Amount = request.Amount,
                    PaymentDate = DateTime.UtcNow,
                    OrderId = order.Id
                });

                await _orderRepository.SaveChangesAsync();
            });

            try 
            {
                if (!string.IsNullOrEmpty(recipientEmail))
                {
                    var (subject, body) = PaymentEmailHelper.GetPaymentConfirmationEmail(order.Id, order.Total);
                    await _emailService.SendEmailAsync(recipientEmail, subject, body);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send confirmation email: {ex.Message}");
            }
        }

        public async Task<IEnumerable<OrderDTO>> GetAllOrdersAsync()
        {
            var orders = await _orderRepository.GetAllOrdersWithDetailsAsync();
            return _mapper.Map<IEnumerable<OrderDTO>>(orders);
        }

        public async Task<PagedResult<OrderDTO>> GetAllOrdersPagedAsync(PaginationParams pagination)
        {
            var (items, totalCount) = await _orderRepository.GetAllOrdersPagedAsync(pagination.Skip, pagination.PageSize);
            return new PagedResult<OrderDTO>
            {
                Items = _mapper.Map<List<OrderDTO>>(items),
                TotalCount = totalCount
            };
        }

        public async Task StartProcessingAsync(int orderId)
        {
            var order = await _orderRepository.GetOrderForProcessingAsync(orderId);

            if (order == null) throw new ArgumentException("Order not found");
            if (order.OrderStatusId != (int)OrderStatusEnum.Paid)
                throw new InvalidOperationException("Order must be paid before processing");

            order.OrderStatusId = (int)OrderStatusEnum.Processing;
            await _orderRepository.UpdateAsync(order);

            await _orderStatusHistoryRepository.AddAsync(
                OrderStatusHelper.CreateStatusChange(order.Id, OrderStatusEnum.Processing, "Order is being prepared for shipment"));

            await _orderRepository.SaveChangesAsync();
        }

        public async Task ShipOrderAsync(int orderId, string carrier, string trackingNumber)
        {
            var order = await _orderRepository.GetOrderForProcessingAsync(orderId);

            if (order == null) throw new ArgumentException("Order not found");

            if (order.OrderStatusId != (int)OrderStatusEnum.Processing)
                throw new InvalidOperationException("Order must be in Processing status before shipping");

            order.OrderStatusId = (int)OrderStatusEnum.Shipped;
            await _orderRepository.UpdateAsync(order);

            var shipment = new Shipment
            {
                OrderId = orderId,
                WarehouseId = ServiceConstants.DefaultWarehouseId,
                Carrier = carrier,
                TrackingNumber = trackingNumber,
                ShipDate = DateTime.UtcNow,
                ShipmentStatusId = (int)ShipmentStatusEnum.Shipped,
                CreatedAt = DateTime.UtcNow
            };

            await _shipmentRepository.AddAsync(shipment);
            await _shipmentRepository.SaveChangesAsync();

            foreach (var item in order.Items)
            {
                await _shipmentItemRepository.AddAsync(new ShipmentItem
                {
                    ShipmentId = shipment.Id,
                    OrderItemId = item.Id,
                    Quantity = item.Quantity
                });
            }

            await _shipmentStatusHistoryRepository.AddAsync(
                ShipmentStatusHelper.CreateShipmentStatusChange(shipment.Id, ShipmentStatusEnum.Shipped, $"Shipment created. Carrier: {carrier}"));

            await _orderStatusHistoryRepository.AddAsync(
                OrderStatusHelper.CreateStatusChange(order.Id, OrderStatusEnum.Shipped, $"Shipped via {carrier}. Tracking: {trackingNumber}"));

            await _shipmentRepository.SaveChangesAsync();
        }

        public async Task DeliverOrderAsync(int orderId)
        {
            var order = await _orderRepository.GetOrderForProcessingAsync(orderId);

            if (order == null) throw new ArgumentException("Order not found");
            if (order.OrderStatusId != (int)OrderStatusEnum.Shipped)
                throw new InvalidOperationException("Order must be shipped before delivery");

            order.OrderStatusId = (int)OrderStatusEnum.Delivered;
            await _orderRepository.UpdateAsync(order);

            var shipment = order.Shipments.FirstOrDefault();
            if (shipment != null)
            {
                shipment.ShipmentStatusId = (int)ShipmentStatusEnum.Delivered;
                shipment.DeliveryDate = DateTime.UtcNow;

                await _shipmentRepository.UpdateAsync(shipment);

                await _shipmentStatusHistoryRepository.AddAsync(
                    ShipmentStatusHelper.CreateShipmentStatusChange(shipment.Id, ShipmentStatusEnum.Delivered, "Shipment delivered"));
            }

            await _orderStatusHistoryRepository.AddAsync(
                OrderStatusHelper.CreateStatusChange(order.Id, OrderStatusEnum.Delivered, "Order delivered to customer"));

            await _orderRepository.SaveChangesAsync();

            try
            {
                var recipientEmail = order.ShippingAddress?.Email ?? order.Customer?.Email;
                if (!string.IsNullOrEmpty(recipientEmail))
                {
                    var (subject, body) = DeliveryEmailHelper.GetDeliveryConfirmationEmail(order.Id);
                    await _emailService.SendEmailAsync(recipientEmail, subject, body);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send delivery email: {ex.Message}");
            }
        }

        public async Task RequestInvoiceAsync(int orderId, int customerId, BillingInfoRequestDTO request)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new ArgumentException("Order not found");
            if (order.CustomerId != customerId) throw new UnauthorizedAccessException("Access denied");

            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                var existing = await _billingDataRepository.FindAsync(x => x.OrderId == orderId);
                var existingData = existing.FirstOrDefault();

                if (existingData == null)
                {
                    var billingData = _mapper.Map<OrderBillingInfo>(request);
                    billingData.OrderId = orderId;
                    billingData.CreatedAt = DateTime.UtcNow;
                    await _billingDataRepository.AddAsync(billingData);
                }
                else
                {
                    _mapper.Map(request, existingData);
                    await _billingDataRepository.UpdateAsync(existingData);
                }

                var invoiceList = await _invoiceRepository.GetByOrderIdWithDetailsAsync(orderId);
                if (invoiceList == null)
                {
                    var statusRequested = (int)InvoiceStatusEnum.Pending;

                    await _invoiceRepository.AddAsync(new Invoice
                    {
                        OrderId = orderId,
                        InvoiceStatusId = statusRequested,
                        IssuedDate = DateTime.UtcNow,
                        Amount = order.Total
                    });
                }

                await _billingDataRepository.SaveChangesAsync();
            });
        }

        public async Task<OrderCountsDTO> GetOrderCountsAsync(int customerId)
        {
            return await _orderRepository.GetOrderCountsAsync(customerId);
        }

        public async Task<object?> GetInvoiceByOrderIdAsync(int orderId, int? userId = null)
        {
            var invoice = await _invoiceRepository.GetByOrderIdWithDetailsAsync(orderId);

            if (invoice == null) return null;

            if (userId.HasValue)
            {
                var order = await _orderRepository.GetByIdAsync(orderId);
                if (order == null || order.CustomerId != userId)
                {
                    return null; 
                }
            }

            var billingList = await _billingDataRepository.FindAsync(x => x.OrderId == orderId);
            var billing = billingList.FirstOrDefault();

            return new
            {
                id = invoice.Id,
                orderId = invoice.OrderId,
                amount = invoice.Amount,
                issuedDate = invoice.IssuedDate,
                statusId = invoice.InvoiceStatusId,
                statusName = invoice.InvoiceStatus?.Name ?? "Unknown",
                buyerName = billing?.BuyerName,
                taxId = billing?.TaxId,
                billingAddress = billing?.Address,
                billingCity = billing?.City,
                billingZipCode = billing?.ZipCode,
                billingCountry = billing?.Country,
                billingEmail = billing?.Email
            };
        }
    }
}