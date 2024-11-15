using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    // Static since we only want a single instance throughout
    // Instead of initialize each of the services in Program.cs
    // we centralize it here
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            // Tell our application about the Databasecontext class that we created in Persistence
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            // Due to browser security, we need to set up Cors policy so that
            // we tell the browser to trust the returned header from API call
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
                });
            });

            // Once we have code in Activities Controller where we setup Query Mediator
            // We need to register our Mediator as a service and then tell where our handler is
            services.AddMediatR(
                cfg =>
                cfg.RegisterServicesFromAssemblies(typeof(List.Handler).Assembly)
            );

            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            return services;
        }
    }
}