using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;

namespace Application.Core
{
    // TRequest and TResponse are type parameters. They are placeholders for the actual types that will be specified when the class is instantiated or used.
    // Initial value of null to validator
    // We then inherit from IPipelineBehavior interface from MediatR library which allows us to add custom behavior before or after the request handler is executed.
    // where TRequest: not null is a type constraint that specifies that TRequest be a non-nullable type
    public class ValidationBehavior<TRequest, TResponse>(IValidator<TRequest>? validator = null)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
    {

        // Handle method takes in a request and then
        // RequestHandlerDelegate<TResponse> next represents what we send out as our response
        // In the context of web development and frameworks like ASP.NET Core or libraries like MediatR, middleware refers to components that process requests and responses as they pass through the application pipeline.
        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            // if validator is null, then we call next() which will call the next middleware in the mediator pipeline
            if (validator == null) return await next();

            // Then check the results of the validation
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            return await next();
        }
    }
}