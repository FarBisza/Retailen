using System.Threading.Tasks;

namespace Retailen.Application.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string email, string subject, string message);
    }
}