using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Profiles.Commands
{
    public class AddPhoto
    {
        // Return a Result<Photo> object and user will not be able to know the url of the photo when it is uploaded
        public class Command : IRequest<Result<Photo>>
        {
            public required IFormFile File { get; set; }
        }

        // Dependency injection of IUserAccessor, DataContext, and IPhotoService
        // as we need to access the current user, database context as we are saving results of the uploaded photo in the database, and the photo service to handle the file upload
        public class Handler(IUserAccessor userAccessor, DataContext context, IPhotoService photoService) : IRequestHandler<Command, Result<Photo>>
        {
            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var uploadedResult = await photoService.UploadPhoto(request.File);

                if (uploadedResult == null)
                {
                    return Result<Photo>.Failure("Failed to upload photo", 400);
                }

                var user = await userAccessor.GetUserAsync();

                var photo = new Photo
                {
                    Url = uploadedResult.Url,
                    PublicId = uploadedResult.PublicId,
                    UserId = user.Id,
                };

                // If user Image URL is null, set it to the uploaded photo URL
                user.ImageUrl ??= photo.Url;

                context.Photos.Add(photo);

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result
                    ? Result<Photo>.Success(photo)
                    : Result<Photo>.Failure("Failed to save the photo to the database", 400);
            }
        }
    }
}