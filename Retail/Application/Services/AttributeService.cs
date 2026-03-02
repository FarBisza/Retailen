using Microsoft.EntityFrameworkCore;
using Retailen.Application.DTO.Attribute;
using Retailen.Application.Interfaces;
using Retailen.Domain.Entities.Product;
using Attribute = Retailen.Domain.Entities.Product.Attribute;
using Retailen.Domain.Entities.Dictionary;
using Retailen.Domain.Interfaces;

namespace Retailen.Application.Services
{
    public class AttributeService : IAttributeService
    {
        private readonly IAttributeRepository _attributeRepository;
        private readonly IRepository<ProductAttribute> _productAttributeRepository;
        private readonly IRepository<AttributeColor> _colorRepository;
        private readonly IRepository<AttributeMaterial> _materialRepository;
        private readonly IRepository<AttributeSize> _sizeRepository;

        public AttributeService(
            IAttributeRepository attributeRepository,
            IRepository<ProductAttribute> productAttributeRepository,
            IRepository<AttributeColor> colorRepository,
            IRepository<AttributeMaterial> materialRepository,
            IRepository<AttributeSize> sizeRepository)
        {
            _attributeRepository = attributeRepository;
            _productAttributeRepository = productAttributeRepository;
            _colorRepository = colorRepository;
            _materialRepository = materialRepository;
            _sizeRepository = sizeRepository;
        }

        public async Task<List<AttributeDTO>> GetAllAttributesAsync()
        {
            var attributes = await _attributeRepository.GetAllAsync();
            return attributes
                .Select(a => new AttributeDTO
                {
                    Id = a.Id,
                    Name = a.Name,
                    DataType = a.DataType,
                    Unit = a.Unit
                })
                .ToList();
        }

        public async Task<AttributeDTO?> GetAttributeByIdAsync(int id)
        {
            var a = await _attributeRepository.GetByIdAsync(id);
            if (a == null) return null;
            return new AttributeDTO
            {
                Id = a.Id,
                Name = a.Name,
                DataType = a.DataType,
                Unit = a.Unit
            };
        }

        public async Task<AttributeDTO> CreateAttributeAsync(CreateAttributeDTO dto)
        {
            var code = System.Text.RegularExpressions.Regex.Replace(dto.Name.ToLower(), "[^a-z0-9_]", "_");
            
            var attribute = new Attribute
            {
                Name = dto.Name,
                Code = code, // Generated code
                DataType = dto.DataType,
                Unit = dto.Unit
            };
            
            await _attributeRepository.AddAsync(attribute);
            await _attributeRepository.SaveChangesAsync();
            
            return new AttributeDTO
            {
                Id = attribute.Id,
                Name = attribute.Name,
                DataType = attribute.DataType,
                Unit = attribute.Unit
            };
        }

        public async Task<List<CategoryAttributeDTO>> GetAttributesByCategoryIdAsync(int categoryId)
        {
            var categoryAttributes = await _attributeRepository.GetByCategoryIdWithDetailsAsync(categoryId);

            return categoryAttributes.Select(ca => new CategoryAttributeDTO
                {
                    Id = ca.Attribute.Id,
                    Name = ca.Attribute.Name,
                    DataType = ca.Attribute.DataType,
                    Unit = ca.Attribute.Unit,
                    IsRequired = ca.IsRequired,
                    SortOrder = ca.SortOrder
                })
                .ToList();
        }

        public async Task<List<ProductAttributeDTO>> GetProductAttributesAsync(int productId)
        {
            var productAttributes = await _attributeRepository.GetByProductIdWithDetailsAsync(productId);

            return productAttributes.Select(pa => new ProductAttributeDTO
                {
                    Id = pa.Id,
                    ProductId = pa.ProductId,
                    AttributeId = pa.AttributeId,
                    AttributeName = pa.Attribute.Name,
                    Value = pa.GetValue()
                })
                .ToList();
        }

        public async Task SetProductAttributeAsync(int productId, SetProductAttributeDTO dto)
        {
            var attribute = await _attributeRepository.GetByIdAsync(dto.AttributeId);
            if (attribute == null) throw new ArgumentException("Attribute does not exist");

            var existing = await _attributeRepository.GetProductAttributeAsync(productId, dto.AttributeId);

            if (existing != null)
            {
                existing.SetValue(attribute.DataType, dto.Value);
                await _productAttributeRepository.UpdateAsync(existing);
            }
            else
            {
                var pa = new ProductAttribute
                {
                    ProductId = productId,
                    AttributeId = dto.AttributeId
                };
                pa.SetValue(attribute.DataType, dto.Value);
                await _productAttributeRepository.AddAsync(pa);
            }
            await _productAttributeRepository.SaveChangesAsync();
        }

        public async Task RemoveProductAttributeAsync(int productId, int attributeId)
        {
            var pa = await _attributeRepository.GetProductAttributeAsync(productId, attributeId);
            if (pa != null)
            {
                await _productAttributeRepository.DeleteAsync(pa);
                await _productAttributeRepository.SaveChangesAsync();
            }
        }

        public async Task<List<DictionaryDTO>> GetColorsAsync()
        {
            var colors = await _colorRepository.GetAllAsync();
            return colors.Select(x => new DictionaryDTO { Id = x.Id, Name = x.Name }).ToList();
        }

        public async Task<List<DictionaryDTO>> GetMaterialsAsync()
        {
            var materials = await _materialRepository.GetAllAsync();
            return materials.Select(x => new DictionaryDTO { Id = x.Id, Name = x.Name }).ToList();
        }

        public async Task<List<DictionaryDTO>> GetSizesAsync()
        {
            var sizes = await _sizeRepository.GetAllAsync();
            return sizes.Select(x => new DictionaryDTO { Id = x.Id, Name = x.Name }).ToList();
        }
    }
}