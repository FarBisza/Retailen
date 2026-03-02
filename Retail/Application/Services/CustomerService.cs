using AutoMapper;
using Retailen.Application.DTO;
using Retailen.Application.DTO.Customer;
using Retailen.Application.Pagination;
using Retailen.Application.Interfaces;
using Retailen.Domain.Entities;
using Retailen.Domain.Exceptions;
using Retailen.Domain.Interfaces;

namespace Retailen.Application.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _repository;
        private readonly IMapper _mapper;

        public CustomerService(ICustomerRepository repository, IMapper mapper)
        {
             _repository = repository;
            _mapper = mapper;
        }

        public async Task<CustomerDTO?> GetByIdAsync(int id)
        {
            var customer = await _repository.GetByIdAsync(id);
            return customer == null ? null : _mapper.Map<CustomerDTO>(customer);
        }

        public async Task<CustomerDTO?> GetCurrentUserAsync(int userId)
        {
            return await GetByIdAsync(userId);
        }

        public async Task<IEnumerable<CustomerDTO>> GetAllAsync()
        {
            var customers = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<CustomerDTO>>(customers);
        }

        public async Task<PagedResult<CustomerDTO>> GetAllPagedAsync(PaginationParams pagination)
        {
            var (items, totalCount) = await _repository.GetAllPagedAsync(pagination.Skip, pagination.PageSize);
            return new PagedResult<CustomerDTO>
            {
                Items = _mapper.Map<List<CustomerDTO>>(items),
                TotalCount = totalCount
            };
        }

        public async Task<CustomerDTO> UpdateAsync(int id, UpdateCustomerRequestDTO request)
        {
            var customer = await _repository.GetByIdAsync(id);
            if (customer == null)
                throw new EntityNotFoundException("Customer", id);

            _mapper.Map(request, customer);
            customer.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(customer);
            await _repository.SaveChangesAsync();

            return _mapper.Map<CustomerDTO>(customer);
        }

        public async Task DeleteAsync(int id)
        {
            var customer = await _repository.GetByIdAsync(id);
            if (customer == null)
                throw new EntityNotFoundException("Customer", id);

            await _repository.DeleteAsync(customer);
            await _repository.SaveChangesAsync();
        }

        public async Task SetActiveAsync(int id, bool isActive)
        {
            var customer = await _repository.GetByIdAsync(id);
            if (customer == null)
                throw new EntityNotFoundException("Customer", id);

            customer.Active = isActive;
            customer.UpdatedAt = DateTime.UtcNow;
            
            await _repository.UpdateAsync(customer);
            await _repository.SaveChangesAsync();
        }

        public async Task SetRoleAsync(int id, int roleId)
        {
            if (roleId < 1 || roleId > 5)
                throw new BusinessRuleException("Invalid role ID. Valid roles: 1=Admin, 2=Manager, 3=Employee, 4=Customer, 5=Supplier");

            var customer = await _repository.GetByIdAsync(id);
            if (customer == null)
                throw new EntityNotFoundException("Customer", id);

            customer.RoleId = roleId;
            customer.UpdatedAt = DateTime.UtcNow;
            
            await _repository.UpdateAsync(customer);
            await _repository.SaveChangesAsync();
        }
    }
}