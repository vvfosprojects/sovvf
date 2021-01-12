using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.DeleteDettaglioTipologia;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.InserimentoDettaglioTipologia;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneDettaglioTipologia;
using SO115App.SignalR.Utility;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneDettaglioTipologia
{
    public class NotificationDeleteDettaglioTipologia : INotificationDeleteDettaglioTipologia
    {
        private GetGerarchiaToSend _getGerarchiaToSend;
        private IHubContext<NotificationHub> _notificationHubContext;

        public NotificationDeleteDettaglioTipologia(IHubContext<NotificationHub> NotificationHubContext,
            GetGerarchiaToSend getGerarchiaToSend)
        {
            _getGerarchiaToSend = getGerarchiaToSend;
            _notificationHubContext = NotificationHubContext;
        }

        public async Task SendNotification(DeleteDettaglioTipologiaCommand dettaglioTipologia)
        {
            var SediDaNotificare = _getGerarchiaToSend.Get(dettaglioTipologia.CodiceSede[0]);

            foreach (var sede in SediDaNotificare)
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyDeleteDettaglioTipologia", dettaglioTipologia);
        }
    }
}
