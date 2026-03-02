using Retailen.Application.DTO.Attribute;

namespace Retailen.Application.Interfaces
{
    public interface IAttributeService
    {
        Task<List<AttributeDTO>> GetAllAttributesAsync();
        Task<AttributeDTO?> GetAttributeByIdAsync(int id);
        Task<AttributeDTO> CreateAttributeAsync(CreateAttributeDTO dto);
        Task<List<CategoryAttributeDTO>> GetAttributesByCategoryIdAsync(int categoryId);
        Task<List<ProductAttributeDTO>> GetProductAttributesAsync(int productId);
        Task SetProductAttributeAsync(int productId, SetProductAttributeDTO dto);
        Task RemoveProductAttributeAsync(int productId, int attributeId);

        // Dictionary Tables
        Task<List<DictionaryDTO>> GetColorsAsync();
        Task<List<DictionaryDTO>> GetMaterialsAsync();
        Task<List<DictionaryDTO>> GetSizesAsync();
    }
}