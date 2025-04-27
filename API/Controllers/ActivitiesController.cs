using Application.Activities;
using Application.Activities.Commands;
using Application.Activities.DTOs;
using Application.Activities.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// Creating our Endpoints
namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        /* For query related stuffs */
        [HttpGet] // -> api/activities = retrieve all activities
        public async Task<ActionResult<List<ActivityDto>>> GetActivities()
        {
            // From our List class in Application
            // and then initialize our class constructor - Query
            // note: Mediator is from derived class BaseApiController
            return await Mediator.Send(new GetActivityList.Query());
        }

        // -> api/activities/{id of activity} = retrieve specific activity
        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityDto>> GetActivity(string id)
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
        [HttpPut("{id}")] // -> updating resource
        [Authorize(Policy = "IsActivityHost")] // -> policy from our service that we registered in Program.cs -> ApplicationServiceExtensions.cs
        public async Task<ActionResult> EditActivity(string id, EditActivityDto activity)
        {   
            // When editing an activity, we will set the id we retrieve from the URL (route parameter) to the activity object that we are passing in the body of the request.
            activity.Id = id;
            // and then send activity to our handler
            return HandleResult(await Mediator.Send(new EditActivity.Command{ ActivityDto = activity }));
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "IsActivityHost")] // also dont want non-hosts to delete the activity
        public async Task<ActionResult> DeleteActivity(string id) 
        {
            return HandleResult(await Mediator.Send(new DeleteActivity.Command { Id = id }));    
        }

        // note: activityID is the {id} in the route
        [HttpPost("{id}/attend")]
        public async Task<ActionResult<Unit>> Attend(string id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
        }
        /* Command end */
    }
}