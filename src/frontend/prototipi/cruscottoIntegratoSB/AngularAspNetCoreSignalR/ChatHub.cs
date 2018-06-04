using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace AngularAspNetCoreSignalR
{
    public class ChatHub : Hub
    {
        public void SendToAll(string name, string message)
        {
            Clients.All.SendAsync("sendToAll", name, message);
        }
    }
}