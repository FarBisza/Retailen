using AutoMapper;
using Retailen.Application.DTO;
using Retailen.Application.DTO.Return;
using Retailen.Application.Pagination;
using Retailen.Application.Interfaces;
using Retailen.Domain.Entities;
using Retailen.Domain.Enums;
using Retailen.Domain.Exceptions;
using Retailen.Domain.Interfaces;

namespace Retailen.Application.Services
{
    public class ReturnService : IReturnService
    {
        private readonly IReturnRepository _returnRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IInventoryService _inventoryService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ReturnService(
            IReturnRepository returnRepository,
            IOrderRepository orderRepository,
            IInventoryService inventoryService,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _returnRepository = returnRepository;
            _orderRepository = orderRepository;
            _inventoryService = inventoryService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ReturnDTO>> GetAllAsync()
        {
            var returns = await _returnRepository.GetAllWithDetailsAsync();
            return _mapper.Map<IEnumerable<ReturnDTO>>(returns);
        }

        public async Task<PagedResult<ReturnDTO>> GetAllPagedAsync(PaginationParams pagination)
        {
            var (items, totalCount) = await _returnRepository.GetAllPagedAsync(pagination.Skip, pagination.PageSize);
            return new PagedResult<ReturnDTO>
            {
                Items = _mapper.Map<List<ReturnDTO>>(items.ToList()),
                TotalCount = totalCount
            };
        }

        public async Task<IEnumerable<ReturnDTO>> GetByCustomerIdAsync(int customerId)
        {
            var returns = await _returnRepository.GetByCustomerIdWithDetailsAsync(customerId);
            return _mapper.Map<IEnumerable<ReturnDTO>>(returns);
        }

        public async Task<IEnumerable<ReturnDTO>> GetByStatusAsync(int statusId)
        {
            var returns = await _returnRepository.GetByStatusWithDetailsAsync(statusId);
            return _mapper.Map<IEnumerable<ReturnDTO>>(returns);
        }

        public async Task<ReturnDTO?> GetByIdAsync(int id)
        {
            var returnEntity = await _returnRepository.GetByIdWithDetailsAsync(id);
            return returnEntity == null ? null : _mapper.Map<ReturnDTO>(returnEntity);
        }

        public async Task<ReturnDTO> CreateAsync(int customerId, CreateReturnRequestDTO request)
        {
            var order = await _orderRepository.GetByIdAsync(request.OrderId);

            if (order == null || order.CustomerId != customerId)
                throw new EntityNotFoundException("Order", request.OrderId);

            decimal refundAmount = 0;

            if (request.OrderItemId.HasValue)
            {
                var orderWithItems = await _orderRepository.GetByIdWithDetailsAsync(request.OrderId);
                var orderItem = orderWithItems?.Items.FirstOrDefault(oi => oi.Id == request.OrderItemId);

                if (orderItem != null)
                    refundAmount = orderItem.UnitPrice * request.Quantity;
            }
            else
            {
                refundAmount = order.Total;
            }

            var returnEntity = new Return
            {
                OrderId = request.OrderId,
                CustomerId = customerId,
                ReturnStatusId = (int)ReturnStatus.Pending,
                OrderItemId = request.OrderItemId,
                Quantity = request.Quantity,
                Reason = request.Reason,
                Description = request.Description,
                RefundAmount = refundAmount,
                CreatedAt = DateTime.UtcNow
            };

            await _returnRepository.AddAsync(returnEntity);
            await _returnRepository.SaveChangesAsync();

            return _mapper.Map<ReturnDTO>(returnEntity);
        }

        public async Task<ReturnDTO> UpdateStatusAsync(int id, UpdateReturnStatusDTO request)
        {
            var returnEntity = await _returnRepository.GetByIdWithDetailsAsync(id);

            if (returnEntity == null)
                throw new EntityNotFoundException("Return", id);

            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                returnEntity.ReturnStatusId = request.ReturnStatusId;
                returnEntity.UpdatedAt = DateTime.UtcNow;

                if (request.RefundAmount.HasValue)
                    returnEntity.RefundAmount = request.RefundAmount.Value;

                if (!string.IsNullOrEmpty(request.AdminNote))
                    returnEntity.AdminNote = request.AdminNote;

                if (request.ReturnStatusId == (int)ReturnStatus.Approved)
                {
                    returnEntity.ApprovalDate = DateTime.UtcNow;
                    await RestoreInventoryAsync(returnEntity);
                }
                else if (request.ReturnStatusId == (int)ReturnStatus.RefundCompleted)
                {
                    returnEntity.RefundDate = DateTime.UtcNow;
                }

                await _returnRepository.UpdateAsync(returnEntity);
                await _returnRepository.SaveChangesAsync();
            });

            return _mapper.Map<ReturnDTO>(returnEntity);
        }

        public async Task CancelAsync(int id, int customerId)
        {
            var returnEntity = await _returnRepository.GetByIdAsync(id);

            if (returnEntity == null || returnEntity.CustomerId != customerId)
                throw new EntityNotFoundException("Return", id);

            if (returnEntity.ReturnStatusId != (int)ReturnStatus.Pending)
                throw new BusinessRuleException("Only pending returns can be cancelled");

            returnEntity.ReturnStatusId = (int)ReturnStatus.Cancelled;
            returnEntity.UpdatedAt = DateTime.UtcNow;

            await _returnRepository.UpdateAsync(returnEntity);
            await _returnRepository.SaveChangesAsync();
        }

        private async Task RestoreInventoryAsync(Return returnEntity)
        {
            var orderWithItems = await _orderRepository.GetByIdWithDetailsAsync(returnEntity.OrderId);
            if (orderWithItems?.Items == null) return;

            if (returnEntity.OrderItemId.HasValue)
            {
                var orderItem = orderWithItems.Items.FirstOrDefault(oi => oi.Id == returnEntity.OrderItemId);
                if (orderItem != null)
                    await _inventoryService.RestoreStockAsync(orderItem.ProductId, returnEntity.Quantity, returnEntity.OrderId);
            }
            else
            {
                foreach (var item in orderWithItems.Items)
                {
                    await _inventoryService.RestoreStockAsync(item.ProductId, item.Quantity, returnEntity.OrderId);
                }
            }
        }
    }
}