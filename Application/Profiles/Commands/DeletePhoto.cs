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
    public class DeletePhoto
    {
        public class Command : IRequest<Result<Unit>>
        {
            // The ID of the photo 
            // Not the public id which cloudinary uses to identify the photo in its storage
            public required string PhotoId { get; set; }
        }

        public class Handler(DataContext context, IUserAccessor userAccessor, IPhotoService photoService) : IRequestHandler<Command, Result<Unit>>
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

                // Check if the photo is the user's profile photo
                if (photo.Url == user.ImageUrl)
                {
                    return Result<Unit>.Failure("You cannot delete your profile photo.", 400);
                }

                // Delete the photo from Cloudinary (public id is used to identify the photo in Cloudinary)
                await photoService.DeletePhoto(photo.PublicId);

                // Then remove photo from the user's photos collection
                user.Photos.Remove(photo);

                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                return result
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure("Failed to delete photo.", 400);
            }
        }
    }
}