using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.ComposizionePartenza
{
    public class NotificationInserisciRichiestaSoccorsoAereo : INotificationInserisciRichiestaSoccorsoAereo
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IMapperRichiestaSuSintesi _mapperSintesi;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        private readonly IGetBoxRichieste _getBoxRichieste;

        public NotificationInserisciRichiestaSoccorsoAereo(IHubContext<NotificationHub> notificationHubContext, IGetBoxRichieste getBoxRichieste, GetGerarchiaToSend getGerarchiaToSend, IMapperRichiestaSuSintesi mapperSintesi)
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
                if (!command.ResponseAFM.IsError()) //SUCCESSO
                {
                    var sintesi = _mapperSintesi.Map(command.Richiesta);

                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifySuccessAFM", sintesi);

                    _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", new { chiamata = sintesi });

                    Task.Factory.StartNew(() =>
                    {
                        var boxRichieste = _getBoxRichieste.Get(command.CodiciSede.Select(p => new API.Models.Classi.Organigramma.PinNodo(p, true)).ToHashSet());

                        _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxRichieste);
                    });
                }
                else //FALLIMENTO
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyErrorAFM", ((RichiestaSoccorsoAereo)command.Richiesta.ListaEventi.LastOrDefault()).Note);
            });
        }
    }
}
