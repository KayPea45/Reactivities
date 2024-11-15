using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Mvc;

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
            return await Mediator.Send(new List.Query());
        }

        // -> api/activities/{id of activity} = retrieve specific activity
        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            return await Mediator.Send(new Details.Query{Id = id});
        }
        /* Query end */

        /* For command */
        [HttpPost] // -> creating resource 
        public async Task<IActionResult> CreateActivity(Activity activity) {
            await Mediator.Send(new Create.Command { Activity = activity });
            return Ok();
        }

        // From body of request, we get the Guid and Activity
        [HttpPut("{id}")] // -> updating resource
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            // simply assign the id of activity object parameter to id parameter 
            activity.Id = id;
            
            // and then send activity to our handler
            await Mediator.Send(new Edit.Command { Activity = activity });
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id) 
        {
            await Mediator.Send(new Delete.Command { Id = id });

            return Ok();
        }
        /* Command end */
    }
}