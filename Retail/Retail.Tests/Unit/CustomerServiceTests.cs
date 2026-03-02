using AutoMapper;
using Moq;
using Retailen.Application.DTO.Customer;
using Retailen.Application.Services;
using Retailen.Domain.Entities;
using Retailen.Domain.Interfaces;

namespace Retailen.Tests.Unit
{
    public class CustomerServiceTests
    {
        private readonly Mock<ICustomerRepository> _customerRepoMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly CustomerService _service;

        public CustomerServiceTests()
        {
            _customerRepoMock = new Mock<ICustomerRepository>();
            _mapperMock = new Mock<IMapper>();

            _mapperMock.Setup(m => m.Map<CustomerDTO>(It.IsAny<Customer>()))
                .Returns((Customer c) => new CustomerDTO
                {
                    Id = c.Id,
                    FirstName = c.FirstName ?? "",
                    LastName = c.LastName ?? "",
                    Email = c.Email ?? "",
                    IsActive = c.Active,
                    RoleId = c.RoleId,
                    Role = c.Role?.Name ?? "Unknown"
                });

            _mapperMock.Setup(m => m.Map<IEnumerable<CustomerDTO>>(It.IsAny<IEnumerable<Customer>>()))
                .Returns((IEnumerable<Customer> cs) => cs.Select(c => _mapperMock.Object.Map<CustomerDTO>(c)));

            _service = new CustomerService(_customerRepoMock.Object, _mapperMock.Object);
        }

        [Fact]
        public async Task GetById_ExistingCustomer_ReturnsDTO()
        {
            var customer = new Customer { Id = 1, FirstName = "Alice", LastName = "Smith", Email = "alice@test.com" };
            _customerRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(customer);

            var result = await _service.GetByIdAsync(1);

            Assert.NotNull(result);
            Assert.Equal("Alice", result.FirstName);
            Assert.Equal("Smith", result.LastName);
        }

        [Fact]
        public async Task GetById_NonExistent_ReturnsNull()
        {
            _customerRepoMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Customer?)null);

            var result = await _service.GetByIdAsync(999);
            Assert.Null(result);
        }

        [Fact]
        public async Task GetAll_ReturnsAllCustomers()
        {
            var customers = new List<Customer>
            {
                new Customer { Id = 1, FirstName = "A", LastName = "X", Email = "a@test.com" },
                new Customer { Id = 2, FirstName = "B", LastName = "Y", Email = "b@test.com" },
                new Customer { Id = 3, FirstName = "C", LastName = "Z", Email = "c@test.com" }
            };
            _customerRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(customers);

            var result = await _service.GetAllAsync();
            Assert.Equal(3, result.Count());
        }

        [Fact]
        public async Task SetActive_UpdatesCustomerStatus()
        {
            var customer = new Customer { Id = 10, FirstName = "Test", LastName = "User", Email = "t@test.com", Active = true };
            _customerRepoMock.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(customer);
            _customerRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Customer>())).Returns(Task.CompletedTask);
            _customerRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            await _service.SetActiveAsync(10, false);

            Assert.False(customer.Active);
            _customerRepoMock.Verify(r => r.UpdateAsync(customer), Times.Once);
        }

        [Fact]
        public async Task SetRole_UpdatesCustomerRole()
        {
            var customer = new Customer { Id = 11, FirstName = "Test", LastName = "User", Email = "t2@test.com", RoleId = 2 };
            _customerRepoMock.Setup(r => r.GetByIdAsync(11)).ReturnsAsync(customer);
            _customerRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Customer>())).Returns(Task.CompletedTask);
            _customerRepoMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            await _service.SetRoleAsync(11, 3);

            Assert.Equal(3, customer.RoleId);
            _customerRepoMock.Verify(r => r.UpdateAsync(customer), Times.Once);
        }
    }
}
