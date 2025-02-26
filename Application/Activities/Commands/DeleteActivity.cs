using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Commands
{
    public class DeleteActivity
    {
        public class Command : IRequest
        {
            public required string Id;
        }

        public class Handler(DataContext context) : IRequestHandler<Command>
        {
            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await context.Activities.FindAsync([request.Id], cancellationToken: cancellationToken) ?? throw new Exception("Could not find Activity");
                
                // EF tracks and prepares activity to be removed in DB after context is saved
                context.Remove(activity);

                await context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}