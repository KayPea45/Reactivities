using AutoMapper;
using Domain;
using MediatR;
using Persistence;

// Command
namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            // Sending from client-side
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            // Dependency Injection for DataContext and IMapper
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                // create new activity variable and assign it to the Activity from database based on activity id that we passed from our API request
                var activity = await _context.Activities.FindAsync(request.Activity.Id);

                _mapper.Map(request.Activity, activity);
                await _context.SaveChangesAsync();
            }
        }
    }
}