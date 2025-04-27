using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Persistence;

// NOTE: the HttpContextAccessor contains all the information about the current request, such as headers, cookies, user claims, and route data. The IHttpContextAccessor is particularly useful when you need to access the HttpContext outside of controllers or middleware, such as in services or custom authorization handlers.
namespace Infrastructure.Security
{
    public class HostRequirement : IAuthorizationRequirement
    {

    }

    // NOTE: When we return the 403 error will be return which is handled from the AuthorizationHandler. 
    // When a request is made to a protected endpoint, the ASP.NET Core authorization system evaluates all registered authorization handlers for the specified requirement.
    // If none of the handlers call context.Succeed(requirement), the system denies access and returns a 403 Forbidden response.
    public class HostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor) : AuthorizationHandler<HostRequirement>
    {
        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, HostRequirement requirement)
        {
            // Getting the user Id from the claims in the HTTP context. This is typically set when a user logs in and is used to identify the user in the system.
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return;

            // Get access to the root values of the request (which is the activity ID that will be from URL)
            var httpContext = httpContextAccessor.HttpContext;

            // Check if the httpCotext is null or if the route value is not a string, then return (which will return a 403 error) else we will assign the value returned from GetRouteValue to activityId.
            // NOTE: the 'is not string' is a pattern matching feature in C# 7.0 and later. Here the pattern matching expression checks if the value is not of type string and assigns it to the variable if it is.
            if (httpContext?.GetRouteValue("id") is not string activityId) return;

            
            var attendee = await dbContext.ActivityAttendees.SingleOrDefaultAsync(x => x.ActivityId == activityId && x.UserId == userId);

            if (attendee == null) return;

            if (attendee.IsHost)
            {
                // Use the AuthorizationHandlerContext to succeed the requirement. This means that the user is authorized to access the resource.
                context.Succeed(requirement);
            }
            // NOTE: we will need to add this to the Program.cs file in the API project to register the authorization handler with the ASP.NET Core dependency injection system. This will allow the authorization handler to be used in the authorization pipeline for protected endpoints.
        }
    }
}