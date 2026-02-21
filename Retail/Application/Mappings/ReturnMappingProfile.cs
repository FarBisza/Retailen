using AutoMapper;
using Retailen.Application.DTO.Return;
using Retailen.Domain.Entities;
using Retailen.Domain.Enums;

namespace Retailen.Application.Mappings
{
    public class ReturnMappingProfile : Profile
    {
        public ReturnMappingProfile()
        {
            CreateMap<Return, ReturnDTO>()
                .ForMember(d => d.CustomerEmail, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Email : null))
                .ForMember(d => d.CustomerName, opt => opt.MapFrom(src =>
                    src.Customer != null ? $"{src.Customer.FirstName} {src.Customer.LastName}" : null))
                .ForMember(d => d.StatusName, opt => opt.MapFrom(src => GetStatusName(src.ReturnStatusId)))
                .ForMember(d => d.CreatedAt, opt => opt.MapFrom(src =>
                    src.CreatedAt.HasValue ? src.CreatedAt.Value : DateTime.UtcNow));
        }

        private static string GetStatusName(int statusId)
        {
            if (statusId == (int)ReturnStatus.RefundCompleted)
                return "Refund Completed";

            if (Enum.IsDefined(typeof(ReturnStatus), statusId))
                return ((ReturnStatus)statusId).ToString();

            return "Unknown";
        }
    }
}
