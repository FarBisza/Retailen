namespace Retailen.Domain.Interfaces
{
    public interface IUnitOfWork
    {
        Task<IAsyncDisposable> BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
        Task SaveChangesAsync();
        Task ExecuteInTransactionAsync(Func<Task> action);
    }
}
