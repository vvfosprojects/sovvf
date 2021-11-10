using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Classi.NotificheNavbar;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEmergenza;
using SO115App.SignalR.Utility;
using System;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneEmergenze
{
    public class NotificationInsertEmergenza : INotifyInsertEmergenza
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationInsertEmergenza(IHubContext<NotificationHub> notificationHubContext,
                                           GetGerarchiaToSend getGerarchiaToSend)
        {
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        public void Send(Emergenza emergenza)
        {
            var ListaSediDestinatarie = _getGerarchiaToSend.Get(emergenza.CodComandoRichiedente);

            _notificationHubContext.Clients.Group("00").SendAsync("NotifyCreazioneEmergenza", emergenza);

            Parallel.ForEach(ListaSediDestinatarie, sede => {
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyCreazioneEmergenza", emergenza);

                //NOTIFICA NAVBAR
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyNavBar", new Notifica()
                {
                    Titolo = "Nuova Emergenza",
                Descrizione = $"E' stato richiesto un intervento per l'emergenza {emergenza.CodEmergenza} da parte del comando {emergenza.CodComandoRichiedente}",
                    Tipo = TipoNotifica.InsertEmergenza,
                    Data = DateTime.Now
                });
                }
            );
        }
    }
}
