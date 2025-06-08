using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Profiles.DTOs;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    // Define as inteface instead of a class.
    public interface IPhotoService
    {
        Task<PhotoUploadResult?> UploadPhoto(IFormFile file);
        Task<string> DeletePhoto(string publicId);
    }
}