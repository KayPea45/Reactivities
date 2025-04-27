using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Manual Join Table for Activity and User
// This is a 1 to many relationship between Activity and between User
// Activity can have many attendees and User can attend many activities
namespace Domain
{
    public class ActivityAttendee
    {
        // NOTE: reason we have ID and the object due to the nature of Entity Framework
        // Set the Id to be string? to allow for null values and set objects to be nullable. ! means that we are sure that it will not be null when we use it so we tell the compiler to ignore the nullability warning
        public string? UserId { get; set; }
        public User User { get; set; } = null!;

        public string? ActivityId { get; set; }
        public Activity Activity { get; set; } = null!;

        public bool IsHost { get; set; }
        public DateTime DateJoined { get; set; } = DateTime.UtcNow;
    }
}