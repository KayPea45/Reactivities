using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

// Command - do not return data, but add or modify data (does not return anything)
namespace Application.Activities.Commands
{
    public class CreateActivity
    {
        public class Command : IRequest<string> 
        {
            public required Activity Activity { get; set; }
        }

        public class Handler(DataContext context) : IRequestHandler<Command, string>
        {
             private readonly DataContext _context = context;

            public async Task<string> Handle(Command request, CancellationToken cancellationToken)
            {
                // asking EF to track the activity put it in memory and not in database
                // No need to use AddAsync, based on description of the method
                // we only need to use if we need to retrieve a value that the database generates
                _context.Activities.Add(request.Activity);

                // then after thats done, we save the changes into the database
                await _context.SaveChangesAsync(cancellationToken);

                // Return the id of the activity back to client
                // NOTE: We create the Id on the backend from Activity.cs in Domain layer
                return request.Activity.Id;
            }
        }
    }
}