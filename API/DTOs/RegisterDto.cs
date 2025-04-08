using System.ComponentModel.DataAnnotations;

// NOTE: We normally have DTOs in application, but due to the nature in which we implement for Identity, we need to create it within the API layer
// so that we can use the Data Annotations for validation. We will not be using FluentValidation for this
// Dto class to register new uers
namespace API.DTOs
{
    // Properties we want to retrieve from the user when they sign up
    public class RegisterDto
    {
        // We want the Controller to handle the validation for this
        // Instead of using FluentValidation, we use Data annotation
        // NOTE: we want validation message to be standard without the JSON serialization kind of error so we set to empty string. If we set it to nothing then there is a chance for null value which will include JSON serialisation in error message, making it less understandable
        [Required]
        public string DisplayName { get; set; } = "";
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";

        // Identity will enforce a strong password so Required is not needed
        public string Password { get; set; } = "";

    }
}