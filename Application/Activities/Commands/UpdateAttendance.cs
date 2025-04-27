using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

// Toggles attendance for user in activity and cancels activity if user is host
namespace Application.Activities.Commands
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required string Id { get; set; }
        }

        public class Handler(IUserAccessor userAccessor, DataContext context) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // Can use eagerly loading to retrieve the activity which includes the attendees and User
                // NOTE: Using SingleOrDefaultAsync difference from FirstOrDefaultAsync is that it will throw an exception if there are multiple records found
                var activity = await context.Activities
                    .Include(x => x.Attendees)
                    .ThenInclude(x => x.User)
                    .SingleOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

                if (activity == null) return Result<Unit>.Failure("Activity not found", 404);

                // Get the current logged in user
                var user = await userAccessor.GetUserAsync();

                // Check if the user is in the activity
                var attendance = activity.Attendees.FirstOrDefault(x => x.UserId == user.Id);

                // Check if the user is the host of the activity
                var isHost = activity.Attendees.Any(x => x.IsHost && x.UserId == user.Id);

                // toggle logic
                // If the user is a host, we will cancel the activity
                // Else, we will remove the user from the activity if they found as an attendee in the activity
                // Else, if attendance is null, we will add the user to the activity as an attendee
                if (attendance != null)
                {
                    if (isHost)
                    {
                        activity.IsCancelled = !activity.IsCancelled;
                    }
                    else
                    {
                        activity.Attendees.Remove(attendance);
                    }
                }
                else
                {
                    activity.Attendees.Add(new ActivityAttendee
                    {
                        UserId = user.Id,
                        ActivityId = activity.Id,
                        IsHost = false
                    });
                }

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result
                    ? Result<Unit>.Success(Unit.Value) 
                    : Result<Unit>.Failure("Problem updating the DB", 400);
            }
        }
    }
}