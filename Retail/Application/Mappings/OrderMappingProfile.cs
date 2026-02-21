using AutoMapper;
using Retailen.Application.DTO.Order;
using Retailen.Domain.Entities;
using Retailen.Domain.Enums;

namespace Retailen.Application.Mappings
{
    public class OrderMappingProfile : Profile
    {
        public OrderMappingProfile()
        {
            // Order → OrderDTO
            CreateMap<Order, OrderDTO>()
                .ForMember(dest => dest.StatusId,  opt => opt.MapFrom(src => src.OrderStatusId))
                .ForMember(dest => dest.Status,    opt => opt.MapFrom(src =>
                    src.OrderStatusEntity != null ? src.OrderStatusEntity.Name :
                    src.OrderStatusId == (int)OrderStatusEnum.AwaitingPayment ? "AwaitingPayment" :
                    src.OrderStatusId == (int)OrderStatusEnum.Paid ? "Paid" :
                    src.OrderStatusId == (int)OrderStatusEnum.Processing ? "Processing" :
                    src.OrderStatusId == (int)OrderStatusEnum.Shipped ? "Shipped" :
                    src.OrderStatusId == (int)OrderStatusEnum.Delivered ? "Delivered" :
                    src.OrderStatusId == (int)OrderStatusEnum.Cancelled ? "Cancelled" : "Unknown"))
                .ForMember(dest => dest.OrderDate, opt => opt.MapFrom(src => src.OrderDate))
                .ForMember(dest => dest.Total,     opt => opt.MapFrom(src => src.Total))
                .ForMember(dest => dest.Items,     opt => opt.MapFrom(src => src.Items))
                .ForMember(dest => dest.Shipment,  opt => opt.MapFrom(src =>
                    src.Shipments.FirstOrDefault()))
                .ForMember(dest => dest.ShippingAddress, opt => opt.MapFrom(src => src.ShippingAddress))
                .ForMember(dest => dest.HasInvoice, opt => opt.MapFrom(src => src.Invoices != null && src.Invoices.Any()));

            // OrderShippingAddress → ShippingAddressDTO
            CreateMap<OrderShippingAddress, ShippingAddressDTO>();

            // OrderItem → OrderItemDTO
            CreateMap<OrderItem, OrderItemDTO>()
                .ForMember(dest => dest.Id,          opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ProductId,   opt => opt.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src =>
                    src.Product != null ? src.Product.Name : "Product"))
                .ForMember(dest => dest.Quantity,    opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.UnitPrice,   opt => opt.MapFrom(src => src.UnitPrice))
                .ForMember(dest => dest.ImageUrl,    opt => opt.MapFrom(src =>
                    src.Product != null ? src.Product.ImageUrl : null));

            // Shipment → ShipmentInfoDTO
            CreateMap<Shipment, ShipmentInfoDTO>()
                .ForMember(dest => dest.TrackingNumber,   opt => opt.MapFrom(src => src.TrackingNumber))
                .ForMember(dest => dest.Carrier,          opt => opt.MapFrom(src => src.Carrier))
                .ForMember(dest => dest.ShippedDate,      opt => opt.MapFrom(src => src.ShipDate))
                .ForMember(dest => dest.DeliveredDate,    opt => opt.MapFrom(src => src.DeliveryDate))
                .ForMember(dest => dest.ShipmentStatusId, opt => opt.MapFrom(src => src.ShipmentStatusId));
        }
    }
}