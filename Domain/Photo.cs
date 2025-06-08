using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain
{
    public class Photo
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public required string Url { get; set; }
        public required string PublicId { get; set; }

        // navigation property
        // If we wanted to also delete the associated photos when the user is deleted, we would need to add a cascade delete to the relationship in the DataContext class. 
        // NOTE: Another way to handle this is to leave the photos in db anyway even if the user is deleted. We delete the photos of deleted users in a whole batch in daily/weekly/monthly intervals.
        public required string UserId { get; set; }

        // Data annotation here is used to ignore this property when serializing the Photo object to JSON.
        // This is to fix the circular reference issue when serializing the Photo object to JSON, as the User object has a collection of Photos and the Photo object has a reference to the User object.
        [JsonIgnore]
        public User User { get; set; } = null!;
    }
}