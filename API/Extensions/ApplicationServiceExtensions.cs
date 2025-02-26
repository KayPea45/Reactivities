using Application.Activities.Queries;
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
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000","https://localhost:3000");
                });
            });

            // Once we have code in Activities Controller where we setup Query Mediator
            // We need to register our Mediator as a service and then tell where our handler is
            // NOTE: This specifies that the assembly where the List.Handler type is defined will be scanned. It effectively tells MediatR to look for any classes that implement the request or notification handlers within that assembly. By doing this, you ensure that all necessary handlers are registered automatically.
            services.AddMediatR(
                cfg =>
                cfg.RegisterServicesFromAssemblies(typeof(GetActivityList.Handler).Assembly)
            );

            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            return services;
        }
    }
}