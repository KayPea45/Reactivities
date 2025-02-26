using Application.Activities;
using Application.Activities.Commands;
using Application.Activities.Queries;
using Domain;
using Microsoft.AspNetCore.Mvc;

// Creating our Endpoints
namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        /* For query related stuffs */
        [HttpGet] // -> api/activities = retrieve all activities
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            // From our List class in Application
            // and then initialize our class constructor - Query
            // note: Mediator is from derived class BaseApiController
            return await Mediator.Send(new GetActivityList.Query());
        }

        // -> api/activities/{id of activity} = retrieve specific activity
        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(string id)
        {
            return await Mediator.Send(new GetActivityDetails.Query{Id = id});
        }
        /* Query end */

        /* For command */
        [HttpPost] // -> creating resource 
        public async Task<ActionResult<string>> CreateActivity(Activity activity) {
            return await Mediator.Send(new CreateActivity.Command { Activity = activity });
        }

        // From body of request, we get the Guid and Activity
        [HttpPut] // -> updating resource
        public async Task<IActionResult> EditActivity(Activity activity)
        {
            // and then send activity to our handler
            await Mediator.Send(new EditActivity.Command { Activity = activity });
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(string id) 
        {
            await Mediator.Send(new DeleteActivity.Command { Id = id });

            return Ok();
        }
        /* Command end */
    }
}