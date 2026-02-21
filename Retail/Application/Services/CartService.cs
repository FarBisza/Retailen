using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Retailen.Application.DTO.Cart;
using Retailen.Application.Interfaces;
using Retailen.Domain.Entities.Cart;
using Retailen.Domain.Interfaces;

namespace Retailen.Application.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IMapper _mapper;
        private readonly IProductService _productService;

        public CartService(ICartRepository cartRepository, IMapper mapper, IProductService productService)
        {
            _cartRepository = cartRepository;
            _mapper = mapper;
            _productService = productService;
        }

        public async Task<CartDTO> GetCartAsync(int? customerId, string sessionId)
        {
            var cart = await FindCartEntityAsync(customerId, sessionId);

            if (cart == null)
            {
                return new CartDTO
                {
                    Id = 0,
                    CustomerId = customerId,
                    Items = new List<CartItemDTO>()
                };
            }

            return _mapper.Map<CartDTO>(cart);
        }

        public async Task AddToCartAsync(AddToCartRequestDTO request)
        {
            if (request.Quantity <= 0) throw new ArgumentException("Quantity must be greater than zero");

            bool isAvailable = await _productService.CheckAvailabilityAsync(request.ProductId, request.Quantity);
            if (!isAvailable)
            {
                throw new InvalidOperationException("Product unavailable in the required quantity or inactive.");
            }

            var cart = await GetOrCreateCartEntityAsync(request.CustomerId, request.SessionId);

            var existingItem = cart.Items.FirstOrDefault(p => p.ProductId == request.ProductId);
            if (existingItem != null)
            {
                bool canAddMore = await _productService.CheckAvailabilityAsync(request.ProductId, existingItem.Quantity + request.Quantity);
                if (!canAddMore)
                {
                    throw new InvalidOperationException("Cannot add more of this product. Available stock exceeded.");
                }
            }

            cart.AddItem(request.ProductId, request.Quantity);
            
            await _cartRepository.UpdateAsync(cart);
            
            await _cartRepository.SaveChangesAsync();
        }

        public async Task UpdateQuantityAsync(UpdateQuantityRequestDTO request, int? customerId, string sessionId)
        {
            var cart = await _cartRepository.GetCartWithItemsAsync(request.CartId);

            if (cart == null) throw new ArgumentException("Cart not found");

            if (customerId.HasValue)
            {
                if (cart.CustomerId != customerId) throw new UnauthorizedAccessException("You do not own this cart.");
            }
            else
            {
                if (cart.SessionId != sessionId) throw new UnauthorizedAccessException("You do not own this cart.");
            }

            var item = cart.Items.FirstOrDefault(p => p.Id == request.ItemId);
            if (item != null)
            {
                if (request.NewQuantity > item.Quantity)
                {
                    bool isAvailable = await _productService.CheckAvailabilityAsync(item.ProductId, request.NewQuantity);
                    if (!isAvailable)
                    {
                        throw new InvalidOperationException("Cannot update quantity. Insufficient stock available.");
                    }
                }
            }

            cart.UpdateQuantity(request.ItemId, request.NewQuantity);
            await _cartRepository.UpdateAsync(cart);
            await _cartRepository.SaveChangesAsync();
        }

        public async Task RemoveFromCartAsync(int cartId, int itemId, int? customerId, string sessionId)
        {
            var cart = await _cartRepository.GetCartWithItemsAsync(cartId);

            if (cart == null) throw new ArgumentException("Cart not found");

            if (customerId.HasValue)
            {
                if (cart.CustomerId != customerId) throw new UnauthorizedAccessException("You do not own this cart.");
            }
            else
            {
                if (cart.SessionId != sessionId) throw new UnauthorizedAccessException("You do not own this cart.");
            }

            cart.RemoveItem(itemId);
            await _cartRepository.UpdateAsync(cart);
            await _cartRepository.SaveChangesAsync();
        }

        public async Task ClearCartAsync(int cartId, int? customerId, string sessionId)
        {
            var cart = await _cartRepository.GetCartWithItemsAsync(cartId);

            if (cart == null) throw new ArgumentException("Cart not found");

            if (customerId.HasValue)
            {
                if (cart.CustomerId != customerId) throw new UnauthorizedAccessException("You do not own this cart.");
            }
            else
            {
                if (cart.SessionId != sessionId) throw new UnauthorizedAccessException("You do not own this cart.");
            }

            cart.Clear();
            await _cartRepository.UpdateAsync(cart);
            await _cartRepository.SaveChangesAsync();
        }

        public async Task MergeCartAsync(int targetCustomerId, string sourceSessionId)
        {
            var anonCart = await _cartRepository.GetActiveCartBySessionAsync(sourceSessionId);

            if (anonCart == null) return;

            var userCart = await _cartRepository.GetActiveCartByCustomerAsync(targetCustomerId);

            if (userCart == null)
            {
                anonCart.AssignCustomer(targetCustomerId);
                await _cartRepository.UpdateAsync(anonCart);
            }
            else
            {
                foreach (var item in anonCart.Items)
                {
                    userCart.AddItem(item.ProductId, item.Quantity);
                }

                await _cartRepository.DeleteAsync(anonCart);
                await _cartRepository.UpdateAsync(userCart);
            }

            await _cartRepository.SaveChangesAsync();
        }

        public async Task FinalizeCartAsync(int cartId)
        {
            var cart = await _cartRepository.GetByIdAsync(cartId);
            if (cart != null)
            {
                cart.Deactivate();
                await _cartRepository.UpdateAsync(cart);
                await _cartRepository.SaveChangesAsync();
            }
        }

        private async Task<Cart?> FindCartEntityAsync(int? customerId, string sessionId)
        {
            Cart? cart = null;
            if (customerId.HasValue)
            {
                cart = await _cartRepository.GetActiveCartByCustomerAsync(customerId.Value);
            }

            if (cart == null && !string.IsNullOrEmpty(sessionId))
            {
                cart = await _cartRepository.GetActiveCartBySessionAsync(sessionId);
                if (cart != null && customerId.HasValue)
                {
                    cart.AssignCustomer(customerId.Value);
                    await _cartRepository.UpdateAsync(cart);
                    await _cartRepository.SaveChangesAsync();
                }
            }
            return cart;
        }

        private async Task<Cart> GetOrCreateCartEntityAsync(int? customerId, string sessionId)
        {
            var cart = await FindCartEntityAsync(customerId, sessionId);
            if (cart == null)
            {
                cart = new Cart(customerId, sessionId);
                await _cartRepository.AddAsync(cart);
                await _cartRepository.SaveChangesAsync();
            }
            return cart;
        }
    }
}