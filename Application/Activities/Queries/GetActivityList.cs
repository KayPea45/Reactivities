using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries
{
    public class GetActivityList
    {
        // REQUEST
        // Query handler to retrieve list of activities from API call
        // Query class - which we form our request to be passed into our handler
        // Derive from IRequest from MediatR to tell IRequest what object 
        // we are returning from query, in this case it is the List of activity 
        // from Domain
        public class Query : IRequest<List<Activity>>
        {
            // If we need to send data from API 
            // then we add properties here e.g. ID, or the Entity i.e Activity
            // However in this scenario we dont need to pass any additional params
        }

        // RESPONSE
        // Handler class
        // Derive from IRequestHandler which takes in parameter Query (defined above as our request) and then a response which is the List of Activites
        // Use this to fetch data from our database
        public class Handler(DataContext context /*ILogger<List> logger*/) : IRequestHandler<Query, List<Activity>>
        {

            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await context.Activities.ToListAsync(cancellationToken);
            }
        }
    }
}