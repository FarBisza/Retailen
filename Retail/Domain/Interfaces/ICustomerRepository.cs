using Retailen.Domain.Entities;

namespace Retailen.Domain.Interfaces
{
    public interface ICustomerRepository : IRepository<Customer>
    {
        Task<(IEnumerable<Customer> Items, int TotalCount)> GetAllPagedAsync(int skip, int take);
        Task<Customer?> GetByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email);
        Task<Customer?> GetByRefreshTokenAsync(string token);
        Task<Customer?> GetByEmailAndConfirmationTokenAsync(string email, string token);
        Task<Customer?> GetByEmailAndResetTokenAsync(string email, string token);
    }
}
