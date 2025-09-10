using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Profiles.Commands;
using Application.Profiles.DTOs;
using Application.Profiles.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        // When we pass a file via HTTP POST request, it will passed in the form of a form-data instead of a JSON object
        // NOTE: the parameter we have here, is what we pass to cloudinary service to upload the photo. Make sure that the name of the parameter matches the name of the form-data field (key) in the request
        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto(IFormFile file)
        {
            return HandleResult(await Mediator.Send(new AddPhoto.Command { File = file }));
        }

        [HttpGet("{userId}/photos")]
        public async Task<ActionResult<List<Photo>>> GetProfilePhotos(string userId)
        {
            return HandleResult(await Mediator.Send(new GetProfilePhotos.Query { UserId = userId }));
        }

        [HttpDelete("{photoId}/photos")]
        public async Task<ActionResult> DeletePhoto(string photoId)
        {
            return HandleResult(await Mediator.Send(new DeletePhoto.Command { PhotoId = photoId }));
        }

        [HttpPut("{photoId}/setMainPhoto")]
        public async Task<ActionResult> SetMainPhoto(string photoId)
        {
            return HandleResult(await Mediator.Send(new SetMainPhoto.Command { PhotoId = photoId }));
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<UserProfile>> GetProfile(string userId)
        {
            return HandleResult(await Mediator.Send(new GetProfile.Query { UserId = userId }));
        }

        [HttpPut("editProfile")]
        public async Task<ActionResult> EditProfile(EditProfileDTO profileDTO)
        {
            return HandleResult(await Mediator.Send(new EditProfile.Command { ProfileDTO = profileDTO }));
        }

        [HttpPut("{photoId}/unSetMainPhoto")]
        public async Task<ActionResult> UnSetMainPhoto(string photoId)
        {
            return HandleResult(await Mediator.Send(new UnSetMainPhoto.Command { PhotoId = photoId }));
        }
        
    }
}