using Retailen.Application.DTO.Return;
using Retailen.Domain.Entities;

namespace Retailen.Domain.Interfaces
{
    public interface IReturnRepository : IRepository<Return>
    {
        Task<IEnumerable<Return>> GetAllWithDetailsAsync();
        Task<(IEnumerable<Return> Items, int TotalCount)> GetAllPagedAsync(int skip, int take);
        Task<IEnumerable<Return>> GetByCustomerIdWithDetailsAsync(int customerId);
        Task<IEnumerable<Return>> GetByStatusWithDetailsAsync(int statusId);
        Task<Return?> GetByIdWithDetailsAsync(int id);
    }
}
