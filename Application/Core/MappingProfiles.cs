using Application.Activities.DTOs;
using Application.Profiles.DTOs;
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

            // Configure for AutoMapper to map out properties that dont exist in our Activity class
            // When mapping from Activity to ActivityDto as a result of creating an Activity, we will set the HostDisplayName equal to the DisplayName of the User that is the host of the activity and same for HostId from User Id
            // we have ! to override the nullable reference and if IsHost doesnt exist from the Attendees then we will set HostDisplayName and HostId to null
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostDisplayName, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost)!.User.DisplayName))
                .ForMember(d => d.HostId, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost)!.User.Id));

            // We will also need to map the ActivityAttendee class to the UserProfile class
            CreateMap<ActivityAttendee, UserProfile>()
                .ForMember(destinationMember: d => d.Id, o => o.MapFrom(s => s.User.Id))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.User.Bio))
                .ForMember(d => d.ImageUrl, o => o.MapFrom(s => s.User.ImageUrl));

            // We will also need to map the User class to the UserProfile class
            // Since the properties in User and UserProfile are the same, we can use CreateMap to map them directly without needing to specify each property
            CreateMap<User, UserProfile>();

            // Mapping for EditProfileDTO to User
            CreateMap<EditProfileDTO, User>();
        }
    }
}