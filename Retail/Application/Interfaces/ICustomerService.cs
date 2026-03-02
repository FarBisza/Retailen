using Retailen.Application.DTO;
using Retailen.Application.DTO.Customer;
using Retailen.Application.Pagination;

namespace Retailen.Application.Interfaces
{
    public interface ICustomerService
    {
        Task<CustomerDTO?> GetByIdAsync(int id);
        Task<CustomerDTO?> GetCurrentUserAsync(int userId);
        Task<IEnumerable<CustomerDTO>> GetAllAsync();
        Task<PagedResult<CustomerDTO>> GetAllPagedAsync(PaginationParams pagination);
        Task<CustomerDTO> UpdateAsync(int id, UpdateCustomerRequestDTO request);
        Task DeleteAsync(int id);
        Task SetActiveAsync(int id, bool isActive);
        Task SetRoleAsync(int id, int roleId);
    }
}