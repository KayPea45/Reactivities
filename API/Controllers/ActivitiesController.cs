using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        // Create our endpoints
        // We want to query our database and so we will need dependency injection
        // so that we can inject the DataContext inside our API controller classes
        private readonly DataContext _context;

        // Constructor
        public ActivitiesController(DataContext context)
        {
            // instead of this.context = context we use _context 
            _context = context;
        }

        [HttpGet] // -> api/activities = retrieve all activities
        public async Task<ActionResult<List<Activity>>> GetActivities() 
        {
            return await _context.Activities.ToListAsync<Activity>();
        }

        // -> api/activities/{id of activity} = retrieve specific activity
        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id) 
        {
            return await _context.Activities.FindAsync(id);
        }
    }
}