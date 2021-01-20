using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo;
using SO115App.Models.Servizi.CustomMapper;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza;
using SO115App.SignalR.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.ComposizionePartenza
{
    public class NotificationInserisciRichiestaSoccorsoAereo : INotificationInserisciRichiestaSoccorsoAereo
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetBoxRichieste _getBoxRichieste;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly MapperRichiestaAssistenzaSuSintesi _mapperSintesi;

        public NotificationInserisciRichiestaSoccorsoAereo(IHubContext<NotificationHub> notificationHubContext, IGetBoxRichieste getBoxRichieste, GetGerarchiaToSend getGerarchiaToSend, MapperRichiestaAssistenzaSuSintesi mapperSintesi)
        {
            _getGerarchiaToSend = getGerarchiaToSend;
            _getBoxRichieste = getBoxRichieste;
            _notificationHubContext = notificationHubContext;
            _mapperSintesi = mapperSintesi;
        }

        public async Task SendNotification(InserisciRichiestaSoccorsoAereoCommand command)
        {
            //Sedi gerarchicamente superiori alla richiesta che dovanno ricevere la notifica
            var SediDaNotificare = new List<string>();
            if (command.Richiesta.CodSOAllertate != null)
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente, command.Richiesta.CodSOAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente);

            Parallel.ForEach(SediDaNotificare, sede =>
            {
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyInserimentoAFM", command.Richiesta);

                if (!command.ResponseAFM.IsError())
                {
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifySuccessAFM", _mapperSintesi.Map(command.Richiesta));

                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyDettaglioAFM", command.ResponseAFM);

                    Task.Factory.StartNew(() =>
                    {
                        var boxRichieste = _getBoxRichieste.Get(command.CodiciSede.Select(p => new API.Models.Classi.Organigramma.PinNodo(p, true)).ToHashSet());

                        _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxRichieste);
                    });
                }
                else
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyErrorAFM", ((RichiestaSoccorsoAereo)command.Richiesta.ListaEventi.LastOrDefault()).Note);
            });
        }
    }
}
