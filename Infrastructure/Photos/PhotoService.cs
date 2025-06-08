using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Profiles.DTOs;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

// Implementation of the IPhotoService interface
namespace Infrastructure.Photos
{
   public class PhotoService : IPhotoService
   {
      // Bring in Cloudinary to utilize its functions 
      private readonly Cloudinary _cloudinary;

      // Constructor that takes in the configuration settings of Cloudinary
      // good tip for checking overloaded methods: hover to the parenthesis on the function/method and press hold CTRL + SHIFT + SPACE
      public PhotoService(IOptions<CloudinarySettings> config)
      {
         // Create a new instance of Cloudinary using the configuration settings
         var account = new Account(
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
         );

         _cloudinary = new Cloudinary(account);
      }
      
      public async Task<string> DeletePhoto(string publicId)
      {
         var deleteParams = new DeletionParams(publicId);

         var result = await _cloudinary.DestroyAsync(deleteParams);

         if (result.Error != null)
         {
            throw new Exception(result.Error.Message);
         }

         return result.Result;
      }

      public async Task<PhotoUploadResult?> UploadPhoto(IFormFile file)
      {
         if (file.Length > 0)
         {
            // Reading contents of the file from user's request
            // the stream here will be contained in memory of our server 
            // and the using keyword is used here to ensure that the stream is disposed of properly after use
            await using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
               // configuration parameters 
               // these are the parameters that we will send to the Cloudinary API
               File = new FileDescription(file.FileName, stream),
               // Transformation = new Transformation()
               //    .Height(500)
               //    .Width(500)
               //    .Crop("fill")
               Folder = "ReactivitiesProfilePhotos"

            };

            // Upload the file to Cloudinary
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
            {
               throw new Exception(uploadResult.Error.Message);
            }

            // Return the result of the upload
            // The uploadResult object contains information about the uploaded file, such as its public ID and URL
            return new PhotoUploadResult
            {
               PublicId = uploadResult.PublicId,
               Url = uploadResult.SecureUrl.AbsoluteUri //URL of the uploaded photo which we will use in client side
            };
         }

         return null;
      }
   }
}