using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    // passing parameter of an instance of DbContext (which helps communicate with our Database)
    public class DataContext(DbContextOptions options) : DbContext(options)
    {

        // DbSet represent the tables we are creating
        //Activites represents the table name inside the database when it gets created
        public required DbSet<Activity> Activities { get; set; }
    }
}