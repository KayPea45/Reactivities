using Application.Activities.DTOs;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries
{
    public class GetActivityDetails
    {
        // Response of IRequest is Activity
        // But for additional validation stuff, we will need to return Response of Result<Activity> (Result is in Core/Result.cs)
        public class Query : IRequest<Result<ActivityDto>>
        {
            // we need to know the id of the activity we want to return
            public required string Id { get; set; }
        }

        // EF will not automatically retrieve the related data (Attendees) when we query the activity. 
        public class Handler(DataContext context, IMapper mapper) : IRequestHandler<Query, Result<ActivityDto>>
        {
            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                // Eager loading - load the related data (Attendees) when we query the activity
                // But if we do this it will have problems with our JSON serializer, because it will try to serialize the whole object graph (Attendees -> User -> Activities -> Attendees -> User -> Activities ...)
                // So we will need to create a DTO for the Activity and configure the mapping for Activity to ActivityDto
                // This will work for Eager loading, but if we look at our SQL query, we will get a lot of data that we dont need
                // To make it more efficient, we will need to use Projection - only load the data that we need
                var activity = await context.Activities
                    // .Include(a => a.Attendees)
                    // .ThenInclude(x => x.User)
                    .ProjectTo<ActivityDto>(mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(x => request.Id == x.Id, cancellationToken);
                // var activity = await context.Activities.FindAsync([request.Id], cancellationToken); 


                if (activity == null) return Result<ActivityDto>.Failure("Activity not found.", 404);

                // Since we are using Projection, we will not need to map the Activity to ActivityDto again
                // return Result<ActivityDto>.Success(mapper.Map<ActivityDto>(activity));
                return Result<ActivityDto>.Success(activity);
            }
        }
    }
}