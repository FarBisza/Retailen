using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Retailen.Infrastructure.Persistence;
using System;
using System.Collections.Generic;

namespace Retailen.Tests.Integration
{
    public class CustomWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram> where TProgram : class
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureAppConfiguration((context, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    {"UseInMemoryDatabase", "true"},
                    {"InMemoryDatabaseName", "IntegrationTestDb_" + Guid.NewGuid().ToString()}
                });
            });
        }
    }
}
