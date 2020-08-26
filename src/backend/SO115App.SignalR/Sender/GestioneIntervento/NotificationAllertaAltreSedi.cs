using DomainModel.CQRS.Commands.AllertaAltreSedi;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.Notification.AllertaAltreSedi;
using SO115App.SignalR.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneIntervento
{
    public class NotificationAllertaAltreSedi : INotificationAllertaAltreSedi
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiById;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationAllertaAltreSedi(IHubContext<NotificationHub> notificationHubContext,
                                            IGetSintesiRichiestaAssistenzaByCodice getSintesiById,
                                            GetGerarchiaToSend getGerarchiaToSend
                                            )
        {
            _notificationHubContext = notificationHubContext;
            _getSintesiById = getSintesiById;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        public async Task SendNotification(AllertaAltreSediCommand command)
        {
            var sintesi = _getSintesiById.GetSintesi(command.CodiceRichiesta);
            var SediDaNotificare = _getGerarchiaToSend.Get(sintesi.CodSOCompetente, sintesi.CodSOAllertate.ToArray());

            command.Chiamata = sintesi;
            //Invio la notifica alle competenze della richiesta
            foreach (var sede in SediDaNotificare)
            {
                if (!sede.Equals(sintesi.CodSOCompetente))
                    await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAllertaAltreSedi", sintesi);

                await _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", command);
            }

            if (command.CodSediAllertateOld != null)
            {
                foreach (var sede in command.CodSediAllertateOld)
                {
                    await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyDeleteAllertaAltreSedi", command.CodiceRichiesta);
                }
            }
        }
    }
}
