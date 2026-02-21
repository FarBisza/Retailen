using Microsoft.EntityFrameworkCore;

namespace Retailen.Infrastructure.Extensions
{
    public static class QueryableExtensions
    {
        public static async Task<(List<T> Items, int TotalCount)> ToPagedListAsync<T>(
            this IQueryable<T> query, int skip, int take)
        {
            var totalCount = await query.CountAsync();
            var items = await query.Skip(skip).Take(take).ToListAsync();
            return (items, totalCount);
        }
    }
}
