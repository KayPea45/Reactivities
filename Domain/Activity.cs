// using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class Activity
    {

        // NOTE: we have to use public as using private would not allow Entity Framework to access the property

        // use [Key] if the name is going to be a specific name 
        // other than 'Id'
        public string Id { get; set; } = Guid.NewGuid().ToString();

        // We can data annotation to do server side validation but for this application it is not the most optimal way
        // [Required]
        public required string Title { get; set; }   
        public DateTime Date { get; set; }
        public required string Description { get; set; } 
        public required string Category { get; set; }   
        public bool IsCancelled {get; set;} 

        // location props
        public required string City { get; set; }

        public required string Venue { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}