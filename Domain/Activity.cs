namespace Domain
{
    public class Activity
    {
        // use [Key] if the name is going to be a specific name 
        // other than 'Id'
        public Guid Id { get; set; }

        public string Title { get; set; }   

        public DateTime Date { get; set; }

        public string Description { get; set; } 

        public string Category { get; set; }    

        public string City { get; set; }

        public string Venue { get; set; }
    }
}