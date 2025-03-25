using Application.Activities;
using Application.Activities.Commands;
using Application.Activities.DTOs;
using Application.Activities.Queries;
using Domain;
using MediatR;
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
            return HandleResult(await Mediator.Send(new GetActivityDetails.Query{Id = id}));
        }
        /* Query end */

        /* For command */
        [HttpPost] // -> creating resource 
        public async Task<ActionResult<string>> CreateActivity(CreateActivityDto activityDto) {
            return HandleResult(await Mediator.Send(new CreateActivity.Command { ActivityDto = activityDto }));
        }

        // From body of request, we get the Guid and Activity
        [HttpPut] // -> updating resource
        public async Task<ActionResult> EditActivity(EditActivityDto activity)
        {
            // and then send activity to our handler
            return HandleResult(await Mediator.Send(new EditActivity.Command{ ActivityDto = activity }));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteActivity(string id) 
        {
            return HandleResult(await Mediator.Send(new DeleteActivity.Command { Id = id }));    
        }
        /* Command end */
    }
}