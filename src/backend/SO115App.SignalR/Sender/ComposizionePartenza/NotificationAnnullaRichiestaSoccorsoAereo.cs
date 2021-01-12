using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.AnnullaRichiestaSoccorsoAereo;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.ComposizionePartenza
{
    public class NotificationAnnullaRichiestaSoccorsoAereo : INotificationAnnullaRichiestaSoccorsoAereo
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetBoxRichieste _getBoxRichieste;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        public NotificationAnnullaRichiestaSoccorsoAereo(IHubContext<NotificationHub> notificationHubContext, IGetBoxRichieste getBoxRichieste, GetGerarchiaToSend getGerarchiaToSend)
        {
            _getGerarchiaToSend = getGerarchiaToSend;
            _getBoxRichieste = getBoxRichieste;
            _notificationHubContext = notificationHubContext;
        }

        public async Task SendNotification(AnnullaRichiestaSoccorsoAereoCommand command)
        {
            //Sedi gerarchicamente superiori alla richiesta che dovanno ricevere la notifica
            var SediDaNotificare = new List<string>();
            if (command.Richiesta.CodSOAllertate != null)
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente, command.Richiesta.CodSOAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente);

            Parallel.ForEach(SediDaNotificare, sede =>
            {
                _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", command.Richiesta);

                Task.Factory.StartNew(() =>
                {
                    //var boxRichieste = _getBoxRichieste.Get(se)

                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", command.Richiesta);
                });
            });
        }
    }
}
