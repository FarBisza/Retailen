using Retailen.Application.DTO.Attribute;
using Retailen.Domain.Entities.Product;
using Attribute = Retailen.Domain.Entities.Product.Attribute;

namespace Retailen.Domain.Interfaces
{
    public interface IAttributeRepository : IRepository<Attribute>
    {
        Task<IEnumerable<CategoryAttribute>> GetByCategoryIdWithDetailsAsync(int categoryId);
        Task<IEnumerable<ProductAttribute>> GetByProductIdWithDetailsAsync(int productId);
        Task<ProductAttribute?> GetProductAttributeAsync(int productId, int attributeId);
    }
}
