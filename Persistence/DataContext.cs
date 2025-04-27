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

        // Add Dbset for the ActivityAttendee table
        public required DbSet<ActivityAttendee> ActivityAttendees { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // This will create a Primary key for the ActivityAttendee table
            builder.Entity<ActivityAttendee>(x => x.HasKey(a => new { a.ActivityId, a.UserId }));

            // Now to configure the relationship (User to ActivityAttendee) 1 : * (one to many)
            builder.Entity<ActivityAttendee>()
                .HasOne(x => x.User)
                .WithMany(x => x.Activities) // Link to the navigation property in User
                .HasForeignKey(x => x.UserId); // Link to the foreign key property in ActivityAttendee

             // Now to configure the relationship (Activity to ActivityAttendee) 1 : * (one to many)
            builder.Entity<ActivityAttendee>()
                .HasOne(x => x.Activity) // From ActivityAttendee property
                .WithMany(x => x.Attendees) // Link to the navigation property in Activity
                .HasForeignKey(x => x.ActivityId); // Link to the foreign key property in ActivityAttendee
        }
    }
}