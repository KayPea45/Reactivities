// The properties that we need when a user creates a new activity
// A DTO is an object that encapusulates data to be sent between the layers of the application, i.e. from the API to the Application layer and vice versa

/**
    'required' is useful for nullable reference types but in this case it will give us issues when we are doing data validation using data annotation and fluidvalidation which is used in this project. This is because our API controller will try to construct an activity based on the Json object its receiving. When it sees the 'required' keyword, it wont have the ability to format the response how we want it to be when validating the data.
    Thus, we will need to remove the 'required' keyword
**/

// This class will be used as a base class for our ActivityDto classes
// This will be used to store the common properties that will be used in our ActivityDto classes
namespace Application.Activities.DTOs
{
    // Will contain simple properties with no business logic
    // that will help to create a new activity
    // NOTE: our derived classes will need to be mapped to Activity 
    public class BaseActivityDto
    {
        public string Title { get; set; } = ""; 
        public DateTime Date { get; set; }
        public string Description { get; set; } = "";
        public string Category { get; set; } = "";
        
        // location props
        public string City { get; set; } = "";
        public string Venue { get; set; } = "";
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}