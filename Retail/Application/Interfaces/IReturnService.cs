using Retailen.Application.DTO;
using Retailen.Application.DTO.Return;
using Retailen.Application.Pagination;

namespace Retailen.Application.Interfaces
{
    public interface IReturnService
    {
        Task<IEnumerable<ReturnDTO>> GetAllAsync();
        Task<PagedResult<ReturnDTO>> GetAllPagedAsync(PaginationParams pagination);
        Task<IEnumerable<ReturnDTO>> GetByCustomerIdAsync(int customerId);
        Task<IEnumerable<ReturnDTO>> GetByStatusAsync(int statusId);
        Task<ReturnDTO?> GetByIdAsync(int id);
        Task<ReturnDTO> CreateAsync(int customerId, CreateReturnRequestDTO request);
        Task<ReturnDTO> UpdateStatusAsync(int id, UpdateReturnStatusDTO request);
        Task CancelAsync(int id, int customerId);
    }
}