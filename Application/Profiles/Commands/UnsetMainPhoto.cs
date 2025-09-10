using Application.Core;
using MediatR;
using Persistence;

namespace Application.Profiles.Commands
{
    public class UnSetMainPhoto
    {
        public class Command : IRequest<Result<Unit>>
        {
            // The ID of the photo 
            public required string PhotoId { get; set; }
        }

      public class Handler(DataContext context) : IRequestHandler<Command, Result<Unit>>
      {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var photo = await context.Photos.FindAsync([request.PhotoId], cancellationToken);
                if (photo == null) return Result<Unit>.Failure("Photo not found.", 400);

                // Then find the User who owns the photo
                var user = await context.Users.FindAsync([photo.UserId], cancellationToken);
                if (user == null) return Result<Unit>.Failure("User not found.", 400);

                // Check if the photo to be deleted is the user's main photo
                if (user.ImageUrl == photo.Url)
                {
                    user.ImageUrl = null; // Set the user's main photo to null if the photo being deleted is the main photo
                }

                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                if (!result) return Result<Unit>.Failure("Failed to remove the photo.", 400);

                return Result<Unit>.Success(Unit.Value);
            }
      }
   }
}