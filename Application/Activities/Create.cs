using Domain;
using MediatR;
using Persistence;

// Command - do not return data, but add or modify data (does not return anything)
namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;

            }

            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                // Adding the activitiy in memory and not in database
                _context.Activities.Add(request.Activity);

                await _context.SaveChangesAsync();
            }
        }
    }

}