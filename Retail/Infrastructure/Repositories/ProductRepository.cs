using Microsoft.EntityFrameworkCore;
using Retailen.Domain.Entities.Product;
using Retailen.Domain.Interfaces;
using Retailen.Infrastructure.Persistence;

namespace Retailen.Infrastructure.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Product?> GetByIdWithDetailsAsync(int id)
        {
            return await _context.Products
                .Include(p => p.Reviews)
                .Include(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                .Include(p => p.ProductAttributes)
                    .ThenInclude(pa => pa.Attribute)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Product>> GetAllWithDetailsAsync()
        {
            return await _context.Products
                .AsNoTracking()
                .Include(p => p.Reviews)
                .Include(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                .Include(p => p.ProductAttributes)
                    .ThenInclude(pa => pa.Attribute)
                .AsSplitQuery()
                .ToListAsync();
        }

        public async Task<(IEnumerable<Product> Products, int TotalCount)> GetProductsPagedAsync(int page, int pageSize)
        {
            var query = _context.Products
                .AsNoTracking()
                .Include(p => p.Reviews)
                .Include(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                .Include(p => p.ProductAttributes)
                    .ThenInclude(pa => pa.Attribute)
                .AsQueryable();

            var totalCount = await query.CountAsync();

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .AsSplitQuery()
                .ToListAsync();

            return (products, totalCount);
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryIdAsync(int categoryId)
        {
             return await _context.ProductCategories
                .Where(pc => pc.CategoryId == categoryId)
                .Include(pc => pc.Product)
                .Select(pc => pc.Product)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetProductsByIdsAsync(IEnumerable<int> ids)
        {
            return await _context.Products
                .Where(p => ids.Contains(p.Id))
                .ToListAsync();
        }
    }
}
