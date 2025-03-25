using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        // Instead of creating a constructor and getting the mediator for each controllers we can centralize it and get it from the BaseApiController

        private IMediator? _mediator;

        // Avaliable in derived classes, which we can allow access to _mediator
        // If _mediator is null, assign with HttpContext (in this case the BaseApiController) 
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>() ?? throw new InvalidOperationException("IMediator service is unavailable");

        // NOTE: since im not too familiar with protected, protected is used to allow access to the derived classes or base class
        // In this case, ActivitiesController is a derived class of BaseApiController will have access to this method
        // Here we will use this method within our Api Controllers when handling the result of our queries and commands
        protected ActionResult HandleResult<T>(Result<T> result) 
        {   
            // When result is not successful and status error code is 404
            if (!result.IsSuccess && result.Code == 404) return NotFound();
            
            // When result is successful and the value in the result is not null
            if (result.IsSuccess && result.Value != null) return Ok(result.Value);

            return BadRequest(result.Error);
        }
    }
}