using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    // passing parameter of an instance of DbContext (which helps communicate with our Database)
    // With Identity, inherit from IdentityDbContext instead of DbContext
    public class DataContext(DbContextOptions options) : IdentityDbContext<User>(options)
    {

        // DbSet represent the tables we are creating
        //Activites represents the table name inside the database when it gets created
        public required DbSet<Activity> Activities { get; set; }
    }
}