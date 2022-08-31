﻿using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.Models.Classi.Soccorso.Eventi;
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
        private readonly IMapperRichiestaSuSintesi _mapperSintesi;

        public NotificationAnnullaRichiestaSoccorsoAereo(IHubContext<NotificationHub> notificationHubContext, IGetBoxRichieste getBoxRichieste, GetGerarchiaToSend getGerarchiaToSend, IMapperRichiestaSuSintesi mapperSintesi)
        {
            _getGerarchiaToSend = getGerarchiaToSend;
            _getBoxRichieste = getBoxRichieste;
            _notificationHubContext = notificationHubContext;
            _mapperSintesi = mapperSintesi;
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
                if (!command.ResponseAFM.IsError())
                {
                    var sintesi = _mapperSintesi.Map(command.Richiesta);

                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifySuccessAnnullamentoAFM", sintesi);
                    _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", new { chiamata = sintesi });
                }
                else
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyErrorAFM", ((AnnullamentoRichiestaSoccorsoAereo)command.Richiesta.ListaEventi.LastOrDefault()).Note);
            });
        }
    }
}
