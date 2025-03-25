using Application.Activities.DTOs;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

// Command - do not return data, but add or modify data (does not return anything)
namespace Application.Activities.Commands
{
    public class CreateActivity
    {
        public class Command : IRequest<Result<string>>
        {
            public required CreateActivityDto ActivityDto { get; set; }
        }

        public class Handler(DataContext context, IMapper mapper) : IRequestHandler<Command, Result<string>>
        {
            private readonly DataContext _context = context;

            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                // The MediatR handler will handle the validation
                // NOTE: we will need to remove the data annotations, i.e. [Required]
                // There is a way to do the validation without manually adding this to each of our handlers
                // await validator.ValidateAndThrowAsync(request, cancellationToken);

                // Mapping into the Activity class and pass the request that has the CreateActivityDto object
                // NOTE: AutoMapper will produce their own exception if the mapping fails
                var activity = mapper.Map<Activity>(request.ActivityDto);
                
                // asking EF to track the activity put it in memory and not in database
                // No need to use AddAsync, based on description of the method
                // we only need to use if we need to retrieve a value that the database generates
                _context.Activities.Add(activity);

                // then after thats done, we save the changes into the database
                 var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (!result) return Result<string>.Failure("Failed to create the activity", 400);

                return Result<string>.Success(activity.Id);
            }
        }
    }
}