using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Queries
{
    public class GetActivityDetails
    {
        // Response of IRequest is Activity
        // But for additional validation stuff, we will need to return Response of Result<Activity> (Result is in Core/Result.cs)
        public class Query : IRequest<Result<Activity>>
        {
            // we need to know the id of the activity we want to return
            public required string Id { get; set; }
        }

        public class Handler(DataContext context) : IRequestHandler<Query, Result<Activity>>
        {
            public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await context.Activities.FindAsync([request.Id], cancellationToken); 

                
               if (activity == null) return Result<Activity>.Failure("Activity not found.", 404);

                return Result<Activity>.Success(activity);
            }
        }
    }
}