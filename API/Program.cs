using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

/* Add services to the container. NOTE: order does not matter */
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Tell our application about the Databasecontext class that we created in Persistence
builder.Services.AddDbContext<DataContext>(opt => {
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Due to browser security, we need to set up Cors policy so that
// we tell the browser to trust the returned header from API call
builder.Services.AddCors(opt => {
    opt.AddPolicy("CorsPolicy", policy => {
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
    });
});
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
