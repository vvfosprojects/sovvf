using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.InserimentoDettaglioTipologia;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneDettaglioTipologia;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using SO115App.SignalR.Utility;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneDettaglioTipologia
{
    public class NotificationAddDettaglioTipologia : INotificationAddDettaglioTipologia
    {
        private GetGerarchiaToSend _getGerarchiaToSend;
        private IHubContext<NotificationHub> _notificationHubContext;

        public NotificationAddDettaglioTipologia(IHubContext<NotificationHub> NotificationHubContext,
            GetGerarchiaToSend getGerarchiaToSend)
        {
            _getGerarchiaToSend = getGerarchiaToSend;
            _notificationHubContext = NotificationHubContext;
        }

        public async Task SendNotification(AddDettaglioTipologiaCommand dettaglioTipologia)
        {
            var SediDaNotificare = _getGerarchiaToSend.Get(dettaglioTipologia.CodiceSede[0]);

            foreach (var sede in SediDaNotificare)
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddDettaglioTipologia", dettaglioTipologia);
        }
    }
}
