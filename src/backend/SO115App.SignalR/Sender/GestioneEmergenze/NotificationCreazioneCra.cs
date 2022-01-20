using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Classi.NotificheNavbar;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEmergenza;
using SO115App.SignalR.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneEmergenze
{
    public class NotificationCreazioneCra : INotifyCreazioneCra
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationCreazioneCra(IHubContext<NotificationHub> notificationHubContext,
                                           GetGerarchiaToSend getGerarchiaToSend)
        {
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        void INotifyCreazioneCra.Send(Emergenza emergenza)
        {
            var ListaSediDestinatarie = _getGerarchiaToSend.Get(emergenza.CodComandoRichiedente);

            _notificationHubContext.Clients.Group("00").SendAsync("NotifyModificaEmergenza", emergenza);

            Parallel.ForEach(ListaSediDestinatarie, sede =>
                {
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyModificaEmergenza", emergenza);

                    //NOTIFICA NAVBAR
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyNavBar", new Notifica()
                    {
                        Titolo = "Emergenza aggiornata",
                        Descrizione = $"E' stato creato un Cra per l'emergenza {emergenza.CodEmergenza}",
                        Tipo = TipoNotifica.UpDateEmergenza,
                        Data = DateTime.Now
                    });
                }
            );
        }
    }
}
