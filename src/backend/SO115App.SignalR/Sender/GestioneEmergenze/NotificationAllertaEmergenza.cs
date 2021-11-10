using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Classi.NotificheNavbar;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEmergenza;
using System;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneEmergenze
{
    public class NotificationAllertaEmergenza : INotifyAllerta
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public NotificationAllertaEmergenza(IHubContext<NotificationHub> notificationHubContext)
        {
            _notificationHubContext = notificationHubContext;
        }

        public async Task Send(Emergenza emergenza)
        {
            await _notificationHubContext.Clients.Group("00").SendAsync("NotifyAllertaEmergenza", emergenza);

            //NOTIFICA NAVBAR
            await _notificationHubContext.Clients.Group("00").SendAsync("NotifyNavBar", new Notifica()
            {
                Titolo = "Allerta Emergenza",
                Descrizione = $"E' stato richiesto un intervento per l'emergenza {emergenza.CodEmergenza} da parte del comando {emergenza.CodComandoRichiedente}",
                Tipo = TipoNotifica.AllertaEmergenza,
                Data = DateTime.Now
            });

        }
    }
}
