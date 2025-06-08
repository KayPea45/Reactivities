
using Domain;

namespace Application.Interfaces
{
    // NOt a class, but an interface which does not have implementation logic
    public interface IUserAccessor
    {
        // We specify the signature of the methods
        string GetUserId();

        Task<User> GetUserAsync();

        Task<User> GetUserWithPhotosAsync();
    }
}