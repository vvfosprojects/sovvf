using System.Threading.Tasks;
using SO115App.API.Models.Classi.Notifications;
using Microsoft.AspNetCore.SignalR;

namespace SO115App.API.Hubs
{
    public class NotificationHub : Hub
    {

        public async Task AddToGroup(string group)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, group);
            await base.OnConnectedAsync();
        }

        public async Task RemoveToGroup(string group)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);
            await base.OnConnectedAsync();
        }

        public async Task SendMessage(Notification message)
		{
			await Clients.Group(message.group).SendAsync("ReceiveMessage", message);
		}


    }
}