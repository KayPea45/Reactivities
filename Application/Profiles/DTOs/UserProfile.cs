using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// DTO for when we create a new user
// This is the data that we will send to the client when we create a new user
namespace Application.Profiles.DTOs
{
    public class UserProfile
    {
        public required string Id { get; set; }
        public required string DisplayName { get; set; } 
        public string? Bio { get; set; }
        public string? ImageUrl { get; set; }
    }
}