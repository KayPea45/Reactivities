using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Store the result of the photo upload from the Cloudinary API (the response from cloudinary API will come in the form of a JSON object, so we need to create a class that matches the structure of the JSON object)
// If we were to use another API service, we would need to modify this class.
namespace Application.Profiles.DTOs
{
    public class PhotoUploadResult
    {
        public required string PublicId { get; set; }
        public required string Url { get; set; }
    }
}