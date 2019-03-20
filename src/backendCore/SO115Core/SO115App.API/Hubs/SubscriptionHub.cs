using System.Threading.Tasks;
using SO115App.API.Models.Classi.Notifications;
using Microsoft.AspNetCore.SignalR;
using System;
using SO115App.API.Models.Classi.Autenticazione;

namespace SO115App.API.Hubs
{
    public class SubscriptionHub : Hub
    {
        public async Task AddToGroup(Notification<Utente> utente)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, utente.CodiceSede);
            await Clients.OthersInGroup(utente.CodiceSede).SendAsync("NotifyLogIn", "L'utente " + utente.NominativoUtente + " è stato inserito nella sede " + utente.CodiceSede);
            await base.OnConnectedAsync();
        }

        public async Task RemoveToGroup(Notification<Utente> utente)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, utente.CodiceSede);
            await Clients.OthersInGroup(utente.CodiceSede).SendAsync("NotifyLogOut", "L'utente " + utente.NominativoUtente + " è uscito dalla sede " + utente.CodiceSede);
            await base.OnConnectedAsync();
        }

        public async Task SendMessage(Notification<Utente> utente)
        {     
            await Clients.OthersInGroup(utente.CodiceSede).SendAsync("ReceiveMessage", "L'utente " + utente.NominativoUtente + "ha mandato un messaggio nella sede " + utente.CodiceSede);
        }

    }
}