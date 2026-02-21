using AutoMapper;
using Retailen.Application.DTO.Cart;
using Retailen.Domain.Entities.Cart;

namespace Retailen.Application.Mappings
{
    public class CartMappingProfile : Profile
    {
        public CartMappingProfile()
        {
            // Cart → CartDTO
            CreateMap<Cart, CartDTO>()
                .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.CustomerId))
                .ForMember(dest => dest.Items,      opt => opt.MapFrom(src => src.Items));

            // CartItem → CartItemDTO
            CreateMap<CartItem, CartItemDTO>()
                .ForMember(dest => dest.Id,          opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ProductId,   opt => opt.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.Quantity,    opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src =>
                    src.Product != null ? src.Product.Name : string.Empty))
                .ForMember(dest => dest.UnitPrice,   opt => opt.MapFrom(src =>
                    src.Product != null ? src.Product.Price : 0m))
                .ForMember(dest => dest.ImageUrl,    opt => opt.MapFrom(src =>
                    src.Product != null ? src.Product.ImageUrl : string.Empty));
        }
    }
}