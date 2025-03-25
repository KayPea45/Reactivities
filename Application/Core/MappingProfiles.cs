using Application.Activities.DTOs;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // Looks at properties of first class (retrieved from API request) and compare and store into second class
            // In this case Activity..
            // This allows us to reduce the code we write in Activities/Edit.cs where 
            // dont have to assign each of activity property to the one retrieved from API request.
            CreateMap<Activity, Activity>();

            // When a user creates a new activity, we will need to map the CreateActivityDto to the Activity class
            // Also, we will need to use the CreateActivityDto for our create activity handler
            CreateMap<CreateActivityDto, Activity>();

            CreateMap<EditActivityDto, Activity>();

        }
    }
}