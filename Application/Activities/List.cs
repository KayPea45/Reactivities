using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

// Query
namespace Application.Activities
{
    // Query handler to retrieve list of activities from API call
    public class List
    {
        // Query class - which we form our request to be passed into our handler
        // Derive from IRequest from MediatR to tell IRequest what object 
        // we are returning from query, in this case it is the List of activity 
        // from Domain
        public class Query : IRequest<List<Activity>>
        {
            // If we need to send data from API 
            // then we add properties here e.g. ID
            // However in this scenario we dont need to pass any additional params
        }

        // Handler class
        // Derive from IRequestHandler
        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;

            public Handler(DataContext context, ILogger<List> logger)
            {
                _logger = logger;
                _context = context;

            }
            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                // NOTE: will need to pass cancellation token parameter in ActivitiesController methods if we want to cancel operation
                /*
                try
                {
                    for (var i = 0; i < 10; i++) {
                        cancellationToken.ThrowIfCancellationRequested();
                        await Task.Delay(1000, cancellationToken);

                        _logger.LogInformation($"Task {i} has completed");
                    }
                }
                catch (System.Exception)
                {
                    _logger.LogInformation("Task cancelled");
                    throw;
                }
                */
                return await _context.Activities.ToListAsync();
            }
        }
    }
}