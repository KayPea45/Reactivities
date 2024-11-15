using API.Extensions;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

/* Add services (like extensions installed from Nuget) to the container. NOTE: order does not matter */

builder.Services.AddControllers();
// No need to pass services as the use of 'this' detects the service instance here and adds it automatically
builder.Services.AddApplicationServices(builder.Configuration);
/*End services*/

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");


app.MapControllers();

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
    context.Database.Migrate();
    await Seed.SeedData(context);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}

app.Run();
