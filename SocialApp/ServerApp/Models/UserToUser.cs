using ServerApp.Models;

namespace ServerApp.Helpers
{
    public class UserToUser
    {
        public int UserId { get; set; }
        public User User { get; set; }
        public int FollowerId { get; set; }
        public User Follower { get; set; }
    }
}