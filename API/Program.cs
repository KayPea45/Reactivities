using API.Extensions;
using Microsoft.EntityFrameworkCore;
using Persistence;
using API.Middleware;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;


var builder = WebApplication.CreateBuilder(args);

/* Add services (like extensions installed from Nuget) to the container. NOTE: order does not matter */
// Add an authentication policy that only allows authenticated users to access all the endpoints
builder.Services.AddControllers(opt => {
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});

// No need to pass services as the use of 'this' detects the service instance here and adds it automatically
// NOTE: we can find the AddApplicationServices inside the ApplicationServiceExtensions.cs file
builder.Services.AddApplicationServices(builder.Configuration);
/*End services*/

/* Start of our Middleware pipeline */
var app = builder.Build();

// Configure the HTTP request pipeline.
// Make sure this at the start of the middleware pipeline
app.UseMiddleware<ExceptionMiddleware>();


// We can add our middleware here to manipulate and do something with HTTP requests as it is called from and into our API. Then executed by the API endpoint (typical CRUD operations e.g. GET, POST etc.) will return, something that we have also manipulated, out to client who made the request from URI/URL. e.g. URI/URL https://api.example.com/users/
// if (app.Environment.IsDevelopment())
// {

// }

app.UseCors("CorsPolicy");

// ensure ordering is correct
// we have to authenticate users before giving them authorisation
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
// MapGroup specifies that we follow the same pattern for our other api controllers
app.MapGroup("api").MapIdentityApi<User>(); // e.g. api/login


/* 
    Using - In .Net there is a garbage collector that organises and cleans up unused code
            when it is not used anymore. However, developers do not know when this happens.
            When we want to specify something that is temporary and want it cleaned after it has done its job, we put 'using'.
            In this case, scope variable will be destroyed after it has done its job.
 */
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

// Try creating our Database
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<User>>();
    await context.Database.MigrateAsync(); // Creates DB only if it doesnt exist
    await Seed.SeedData(context, userManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}
/**/

app.Run();
