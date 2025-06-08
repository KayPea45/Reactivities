using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Persistence;

namespace Application.Profiles.Commands
{
    public class SetMainPhoto
    {
         public class Command : IRequest<Result<Unit>>
        {
            // The ID of the photo 
            // Not the public id which cloudinary uses to identify the photo in its storage
            public required string PhotoId { get; set; }
        }

        public class Handler(DataContext context, IUserAccessor userAccessor) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // Gets the users profile with photos from the UserAccessor
                // This will include the photos collection, which is what we need to check if the photo exists and if it is the user's profile photo
                var user = await userAccessor.GetUserWithPhotosAsync();

                // Get the photo from the user's photos collection
                // We are using FirstOrDefault here to get the photo with the matching ID, or null if it does not exist
                var photo = user.Photos.FirstOrDefault(x => x.Id == request.PhotoId);
                if (photo == null)
                {
                    return Result<Unit>.Failure("Photo not found.", 400);
                }

                // Assign the photo as the user's main photo
                // This will update the user's ImageUrl to the photo's URL
                // NOTE: have a look at the User class in Domain project and the Photo class in Domain project. The ImageUrl property in User class is used to store the URL of the user's main photo
                // and the Url property in Photo class is used to store the URL of the photo
                user.ImageUrl = photo.Url;

                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                return result
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure("Failed to set as Main photo.", 400);
            }
        }
    }
}