using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Notifications;
using SO115App.API.Models.Servizi;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Hubs
{
    public class NotificationMarkerHub : Hub
    {
        /// <summary>
        ///  Propagazione di una richiesta in corso a tutti i client che dovranno visualizzare il Marker sulla mappa
        /// </summary>
        public async Task NotifyChiamataInCorsoMarker(Notification<Object> Chiamata)
		{                          
            await Clients.OthersInGroup(Chiamata.CodiceSede).SendAsync("NotifyChiamataInCorsoMarkerSucess", Chiamata.ActionObj);
		}

        /// <summary>
        ///  Propagazione di cancellazione una richiesta in corso a tutti i client che dovranno visualizzare il Marker sulla mappa
        /// </summary>
        public async Task NotifyChiamataInCorsoMarkerDelete(Notification<Object> Chiamata)
		{                          
            await Clients.OthersInGroup(Chiamata.CodiceSede).SendAsync("NotifyChiamataInCorsoMarkerDelete", Chiamata.ActionObj);
		}


    }
}