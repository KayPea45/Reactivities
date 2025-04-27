using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

// NOTE: Because we have an implementation and interface class, we will need to add this as a service in the Program.cs of our API project.
namespace Infrastructure.Security
{
   // Primary constructor syntax is used here, which is a feature of C# 9.0 and later.
   // The primary constructor allows you to define the constructor parameters directly in the class definition.
   // Here we are using the IHttpContextAccessor to access the current HTTP context. This contains the user object which we can use to get the user ID which is passed up in the JWT token/cookie when a user is authenticating to an endpoint (e.g. login)
   public class UserAccessor(IHttpContextAccessor httpContextAccessor, DataContext dataContext) : IUserAccessor
   {
      public async Task<User> GetUserAsync()
      {
         return await dataContext.Users.FindAsync(GetUserId())
         ?? throw new UnauthorizedAccessException("No user is logged in");
      }

      public string GetUserId()
      {
         // We definitely want to return something here
         // If it is null, we throw an exception
         // Here we are using the ClaimTypes.NameIdentifier to get the user ID from the claims in the HTTP context. This is typically set when a user logs in and is used to identify the user in the system.
         return httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("No user found");
      }
   }
}