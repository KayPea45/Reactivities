using API.Middleware;
using Application.Activities.Queries;
using Application.Activities.Validators;
using Application.Core;
using Domain;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
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
            // Scoped to the HTTP request when request is created and instantiated for the duration of the lifetime of the request
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
                    policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000", "https://localhost:3000");
                });
            });

            // Once we have code in Activities Controller where we setup Query Mediator
            // We need to register our Mediator as a service and then tell where our handler is
            // NOTE: This specifies that the assembly where the List.Handler type is defined will be scanned. It effectively tells MediatR to look for any classes that implement the request or notification handlers within that assembly. By doing this, you ensure that all necessary handlers are registered automatically.
            services.AddMediatR(
                cfg =>
                {
                    cfg.RegisterServicesFromAssemblyContaining<GetActivityList.Handler>();
                    /*
                        cfg.AddOpenBehavior(typeof(ValidationBehavior<,>)); adds the ValidationBehavior class as an open generic behavior to the MediatR pipeline.
                        This means that the ValidationBehavior will be applied to all requests and responses handled by MediatR.

                        Pipeline Execution:
                            When a request is sent through MediatR, it passes through the pipeline behaviors before reaching the main request handler.
                            The ValidationBehavior is one of these behaviors and will validate the request before it is handled by the main request handler (CreateActivity Command is executed but the CreateActivity Handler is not yet executed).
                    */
                    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
                }
            );

            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            // Transient means that this service will only be created as needed. E.g. and exception occurs and then disposed of when exception is handled and resolved completely. In comparison to DbContext, as mentioned above, it is scoped to the HTTP request.
            // Ensure we add the middleware and make sure its at top of the middleware pipeline (go to Program.cs)
            services.AddTransient<ExceptionMiddleware>();

            services.AddValidatorsFromAssemblyContaining<CreateActivityValidator>();

            // Service for our Identity/Users
            services.AddIdentityApiEndpoints<User>(opt =>
            {
                // There is bug on Microsoft side. SigninManager will use Email to check instead of username even though it is stated otherwise.
                // So we will treat username as email
                opt.User.RequireUniqueEmail = true;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<DataContext>(); // Let ef know where our users are stored


            return services;
        }
    }
}