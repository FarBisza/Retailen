using Microsoft.EntityFrameworkCore;
using Retailen.Domain.Entities.Product;
using Attribute = Retailen.Domain.Entities.Product.Attribute;
using Retailen.Domain.Interfaces;
using Retailen.Infrastructure.Persistence;

namespace Retailen.Infrastructure.Repositories
{
    public class AttributeRepository : Repository<Attribute>, IAttributeRepository
    {
        public AttributeRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<CategoryAttribute>> GetByCategoryIdWithDetailsAsync(int categoryId)
        {
            return await _context.CategoryAttributes
                .Include(ca => ca.Attribute)
                .Where(ca => ca.CategoryId == categoryId)
                .OrderBy(ca => ca.SortOrder)
                .ToListAsync();
        }

        public async Task<IEnumerable<ProductAttribute>> GetByProductIdWithDetailsAsync(int productId)
        {
            return await _context.ProductAttributes
                .Include(pa => pa.Attribute)
                .Where(pa => pa.ProductId == productId)
                .ToListAsync();
        }

        public async Task<ProductAttribute?> GetProductAttributeAsync(int productId, int attributeId)
        {
             return await _context.ProductAttributes
                .FirstOrDefaultAsync(pa => pa.ProductId == productId && pa.AttributeId == attributeId);
        }
    }
}
