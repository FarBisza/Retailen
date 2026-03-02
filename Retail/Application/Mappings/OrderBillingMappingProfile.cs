using AutoMapper;
using Retailen.Application.DTO.Order;
using Retailen.Domain.Entities;

namespace Retailen.Application.Mappings
{
    public class OrderBillingMappingProfile : Profile
    {
        public OrderBillingMappingProfile()
        {
            // BillingInfoRequestDTO → OrderBillingInfo
            CreateMap<BillingInfoRequestDTO, OrderBillingInfo>()
                .ForMember(dest => dest.BuyerName, opt => opt.MapFrom(src => src.BuyerName))
                .ForMember(dest => dest.TaxId,     opt => opt.MapFrom(src => src.TaxId))
                .ForMember(dest => dest.Address,   opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.City,      opt => opt.MapFrom(src => src.City))
                .ForMember(dest => dest.ZipCode,   opt => opt.MapFrom(src => src.ZipCode))
                .ForMember(dest => dest.Country,   opt => opt.MapFrom(src => src.Country))
                .ForMember(dest => dest.Email,     opt => opt.MapFrom(src => src.Email));
        }
    }
}