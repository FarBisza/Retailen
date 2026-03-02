using Retailen.Domain.Entities;

namespace Retailen.Domain.Interfaces
{
    public interface IPaymentRepository : IRepository<Payment>
    {
        Task<IEnumerable<Payment>> GetByOrderIdAsync(int orderId);
    }
}
