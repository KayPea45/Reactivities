using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        // Instead of creating a constructor and getting the mediator for each controllers we can centralize it and get it from the BaseApiController
        
        private IMediator _mediator;

        // Avaliable in derived classes, which we can allow access to _mediator
        // ??= If _mediator is null, assign with HttpContext (in this case the BaseApiController) 
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();
    }
}