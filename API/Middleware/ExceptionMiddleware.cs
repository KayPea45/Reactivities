
// This will handle the exceptions and
using System.Text.Json;
using Application.Core;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware
{
    // We will need to go to Program.cs (or ApplicationServiceExtension.cs) to tell it about the IMiddleware interface via services.
    public class ExceptionMiddleware(ILogger<ExceptionMiddleware> logger, IHostEnvironment env) : IMiddleware
    {
        // Implement interface
        // HttpContext gives us access to http request and response
        // RequestDelegate next is the next middleware that we pass the request onto
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (ValidationException ex)
            {
                await HandleValidationException(context, ex);
            }
            catch (Exception ex)
            {
                await HandleException(context, ex);
            }
        }

        private async Task HandleException(HttpContext context, Exception ex)
        {
            logger.LogError(ex, ex.Message);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            var response = env.IsDevelopment() ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace) : new AppException(context.Response.StatusCode, ex.Message, null);
            
            var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

            var json = JsonSerializer.Serialize(response, options);

            await context.Response.WriteAsync(json);
        }

        // The ValidationException ex is extracted from the ValidationException throw we have in ValidationBehavior.cs when a validation error occurs
        // ex will have a collection of errors and so we store these in a Dictionary 
        private static async Task HandleValidationException(HttpContext context, ValidationException ex)
        {
            var validationErrors = new Dictionary<string, string[]>();

            // Check if we have errors and then loop through each of the errors and then append to the dictionary 
            if (ex.Errors != null)
            {
                // Loop through and check if key exists, if it does then add error to that key else create a new key and add the associated error
                foreach (var error in ex.Errors)
                {
                    if (validationErrors.TryGetValue(error.PropertyName, out var existingErrors))
                    {
                        // Collection expression introduced in .NET 9
                        // If the key exists, append the error message to the output of the TryGetValue method and then store it back in the dictionary of the associated key
                        validationErrors[error.PropertyName] = [.. existingErrors, error.ErrorMessage];
                        // Another method we can use 
                        // validationErrors[error.PropertyName] = existingErrors.Append(error.ErrorMessage).ToArray();
                        
                    }
                    else 
                    {
                        validationErrors[error.PropertyName] = new [] {error.ErrorMessage};
                        // Another method we can use without use of Collection expression
                        // validationErrors[error.PropertyName] = [error.ErrorMessage];
                    }
                }
            }

            // Modify the response via the context object
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            
            // NOTE: We are using the ValidationProblemDetails class from Microsoft.AspNetCore.Mvc namespace which allows to customize the response
            // Basically here, we are replicating the validation functionality that Microsoft would give if we were leaving the framework to handle the validation, i.e. using the API controller attribute ([ApiController] and then data annotations)
            var validationProblemsDetails = new ValidationProblemDetails(validationErrors) 
            {
                Status = StatusCodes.Status400BadRequest,
                Type = "ValidationFailure",
                Title = "Validation error",
                Detail = "One or more validation errors has occured"
            };
            // We then transform the response to Json and pass back the validation details to the client
            await context.Response.WriteAsJsonAsync(validationProblemsDetails);
            
        }
    }
}