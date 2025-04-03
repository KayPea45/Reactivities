using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    // Derive from our BaseApiController
    // API endpoint here will be 'api/account'
    // Use SignInManager so we can access UserManager as well
    public class AccountController(SignInManager<User> signInManager) : BaseApiController
    {
        // AllowAnonymous to allow non-authenticated users to access endpoint
        [AllowAnonymous]
        [HttpPost("register")] // api/account/register
        public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
        {
            var user = new User
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                DisplayName = registerDto.DisplayName
            };

            var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

            // After success, we return Ok but not loggin the user
            // They will have to do it after registering
            if (result.Succeeded) return Ok();

            // Check for errors, whether from Data Annotation coming from the registerDto, or from UserManager due to weak password or duplicate email address etc.
            foreach (var error in result.Errors)
            {
                // Inherited from our BaseApiController (which inherited from ASP.NET ControllerBase)
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        // Allow access to non-authorised 
        // We will control what we send back whether they are logged in or not
        [AllowAnonymous]
        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfo() 
        {
            // In ASP.NET Core, the User object is a property of the ControllerBase class (from which our BaseApiController and, consequently, AccountController inherit). User object represents the currently authenticated user and is automatically populated by the ASP.NET Core authentication middleware when a request is made to the API.
            // NOTE: Identity? is because the user might not even be authenticated yet (so this might be null)
            if (User.Identity?.IsAuthenticated == false) return NoContent();

            var user = await signInManager.UserManager.GetUserAsync(User);

            if (user == null) return Unauthorized();

            // Send back an Anonymous object
            return Ok(new 
            {
                user.DisplayName,
                user.Email,
                user.Id,
                user.ImageUrl
            });

        }

        // Identity does not have a logout endpoint
        // so we need to create our own
        [HttpPost("logout")]
        public async Task<ActionResult> Logout() 
        {
            // Automatically clears cookies as well. Neat!
            await signInManager.SignOutAsync();

            return NoContent();
        }

        // NOTE: From Instructor of the React ASP.NET course, Neil states:
        /* will need to configure Cors policy in Program.cs so that the cookie that's received from a browser is trusted when it comes from a different origin.

        It's not something we need to worry about when we're using postman, because postman is effectively

        on the same origin as our API, but when we're using our client side code, then we need to update our

        Cors configuration to effectively allow credentials, which means our cookie, our authentication cookie

        can be sent up by our client browser and accepted by our API server*/ 
    }
}