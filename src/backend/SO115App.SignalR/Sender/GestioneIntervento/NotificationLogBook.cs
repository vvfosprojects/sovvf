﻿using DomainModel.CQRS.Commands.AllertaAltreSedi;
using DomainModel.CQRS.Commands.HLogBook;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.Notification.AllertaAltreSedi;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneIntervento;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneIntervento
{
    public class NotificationLogBook : INotificationLogBook
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiById;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationLogBook(IHubContext<NotificationHub> notificationHubContext,
                                            IGetSintesiRichiestaAssistenzaByCodice getSintesiById,
                                            GetGerarchiaToSend getGerarchiaToSend
                                            )
        {
            _notificationHubContext = notificationHubContext;
            _getSintesiById = getSintesiById;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        public async Task SendNotification(LogBookCommand command)
        {
            //var sintesi = _getSintesiById.GetSintesi(command.CodiceRichiesta);

            //var SediDaNotificare = new List<string>();
            //if (sintesi.CodSOAllertate != null)
            //    SediDaNotificare = _getGerarchiaToSend.Get(sintesi.CodSOCompetente, sintesi.CodSOAllertate.ToArray());
            //else
            //    SediDaNotificare = _getGerarchiaToSend.Get(sintesi.CodSOCompetente);

            //command.Chiamata = sintesi;
            ////Invio la notifica alle competenze della richiesta
            //foreach (var sede in SediDaNotificare)
            //{
            //    if (!sede.Equals(sintesi.CodSOCompetente))
            //        await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAllertaAltreSedi", sintesi);

            //    await _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", command);
            //}

            //if (command.CodSediAllertateOld != null)
            //{
            //    foreach (var sede in command.CodSediAllertateOld)
            //    {
            //        await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyDeleteAllertaAltreSedi", command.CodiceRichiesta);
            //    }
            //}
        }
    }
}
