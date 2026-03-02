using AutoMapper;
using Retailen.Application.DTO.Customer;
using Retailen.Application.DTO.Auth;
using Retailen.Domain.Entities;

namespace Retailen.Application.Mappings
{
    public class CustomerMappingProfile : Profile
    {
        public CustomerMappingProfile()
        {
            // Customer → CustomerDTO
            CreateMap<Customer, CustomerDTO>()
                .ForMember(dest => dest.FirstName,    opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.LastName,     opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.Phone,        opt => opt.MapFrom(src => src.Phone))
                .ForMember(dest => dest.Address,      opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.City,         opt => opt.MapFrom(src => src.City))
                .ForMember(dest => dest.ZipCode,      opt => opt.MapFrom(src => src.ZipCode))
                .ForMember(dest => dest.Country,      opt => opt.MapFrom(src => src.Country))
                .ForMember(dest => dest.IsActive,     opt => opt.MapFrom(src => src.Active))
                .ForMember(dest => dest.RoleId,       opt => opt.MapFrom(src => src.RoleId))
                .ForMember(dest => dest.Role,         opt => opt.MapFrom(src => src.Role != null ? src.Role.Name : "Unknown"))
                .ForMember(dest => dest.RegisteredAt, opt => opt.MapFrom(src => src.CreatedAt));

            // Customer → RegisterResponseDTO
            CreateMap<Customer, RegisterResponseDTO>()
                .ForMember(dest => dest.Success, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.Message, opt => opt.MapFrom(src => "Registration successful. Please check your email."));

            // Customer → AuthenticateResponseDTO
            CreateMap<Customer, AuthenticateResponseDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Role, opt => opt.Ignore())       // Set manually in service
                .ForMember(dest => dest.AccessToken, opt => opt.Ignore()) // Set manually in service
                .ForMember(dest => dest.RefreshToken, opt => opt.Ignore()) // Set manually in service
                .ForMember(dest => dest.TokenExpiryTime, opt => opt.Ignore()); // Set manually in service

            // UpdateCustomerRequestDTO → Customer (partial update)
            CreateMap<UpdateCustomerRequestDTO, Customer>()
                .ForAllMembers(opt =>
                    opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}