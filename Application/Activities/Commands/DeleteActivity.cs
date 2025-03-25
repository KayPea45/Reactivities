using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Commands
{
    public class DeleteActivity
    {
        // Unit is a type that represents void when we are not returning anything
        // NOTE: Unit is from MedaitR
        // When doing validation, instead of IRequest, we will return a Result<Unit> (Result in Core/Result.cs)
        public class Command : IRequest<Result<Unit>>
        {
            public required string Id;
        }

        public class Handler(DataContext context) : IRequestHandler<Command, Result<Unit>>
        {
            // For validation, we added a return type of Result<Unit> thus need to define Task as such
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await context.Activities.FindAsync([request.Id], cancellationToken: cancellationToken);

                if (activity == null)
                    return Result<Unit>.Failure("Activity not found.", 404);
                
                // EF tracks and prepares activity to be removed in DB after context is saved
                context.Remove(activity);
                
                // SaveChangesAsync returns an int which is the number of changes made in the database
                // If it is greater than 0, then we know that the changes were saved successfully
                // Else, we know that changes were not successful
                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                
                if (!result)
                    return Result<Unit>.Failure("Failed to delete activity.", 400);
                    
                return Result<Unit>.Success(Unit.Value);

            }
        }
    }
}