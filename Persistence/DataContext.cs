using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        // passing parameter of an instance of DbContext (which helps communicate with our Database)
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        // DbSet represent the tables we are creating
        //Activites represents the table name inside the database when it gets created
        public DbSet<Activity> Activities { get; set; }
    }
}