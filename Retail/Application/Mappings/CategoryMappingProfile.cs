using AutoMapper;
using Retailen.Application.DTO.Product;
using Retailen.Domain.Entities.Product;

namespace Retailen.Application.Mappings
{
    public class CategoryMappingProfile : Profile
    {
        public CategoryMappingProfile()
        {
            CreateMap<Category, CategoryDTO>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name));
        }
    }
}