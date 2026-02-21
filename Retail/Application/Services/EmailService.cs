using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Retailen.Application.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        private const int MaxRetries = 3;
        private static readonly TimeSpan[] RetryDelays = new[]
        {
            TimeSpan.FromSeconds(1),
            TimeSpan.FromSeconds(3),
            TimeSpan.FromSeconds(9)
        };

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var port = int.Parse(_configuration["EmailSettings:Port"] ?? "587");
            var username = _configuration["EmailSettings:Username"];
            var password = _configuration["EmailSettings:Password"];
            var senderEmail = _configuration["EmailSettings:SenderEmail"];
            var senderName = _configuration["EmailSettings:SenderName"];

            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail ?? "no-reply@example.com", senderName ?? "Store"),
                Subject = subject,
                Body = message,
                IsBodyHtml = true
            };
            mailMessage.To.Add(email);

            for (int attempt = 0; attempt <= MaxRetries; attempt++)
            {
                try
                {
                    using var client = new SmtpClient(smtpServer, port)
                    {
                        EnableSsl = true,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(username, password)
                    };

                    await client.SendMailAsync(mailMessage);
                    _logger.LogInformation("Email sent successfully to {Email} on attempt {Attempt}", email, attempt + 1);
                    return;
                }
                catch (SmtpException ex) when (attempt < MaxRetries)
                {
                    _logger.LogWarning(ex,
                        "SMTP failure sending email to {Email} (attempt {Attempt}/{MaxRetries}). Retrying in {Delay}s...",
                        email, attempt + 1, MaxRetries, RetryDelays[attempt].TotalSeconds);
                    await Task.Delay(RetryDelays[attempt]);
                }
                catch (Exception ex) when (attempt < MaxRetries && IsTransientException(ex))
                {
                    _logger.LogWarning(ex,
                        "Transient failure sending email to {Email} (attempt {Attempt}/{MaxRetries}). Retrying in {Delay}s...",
                        email, attempt + 1, MaxRetries, RetryDelays[attempt].TotalSeconds);
                    await Task.Delay(RetryDelays[attempt]);
                }
            }

            using var finalClient = new SmtpClient(smtpServer, port)
            {
                EnableSsl = true,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(username, password)
            };
            await finalClient.SendMailAsync(mailMessage);
        }

        private static bool IsTransientException(Exception ex)
        {
            return ex is TimeoutException
                || ex is System.IO.IOException
                || (ex.InnerException is System.Net.Sockets.SocketException);
        }
    }
}