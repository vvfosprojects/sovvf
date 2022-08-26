using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.Models.Classi.ListaMezziInServizio;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.SignalR.Sender.AggiornamentoBox;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestionePartenza
{
    public class NotificationModificaPartenza : INotifyModificaPartenza
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IMapperRichiestaSuSintesi _mapperSintesi;
        private readonly GetSediPartenze _getSediPartenze;
        private readonly NotificationAggiornaBox _notificationAggiornaBox;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationModificaPartenza(IHubContext<NotificationHub> notificationHubContext,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IMapperRichiestaSuSintesi mapperSintesi,
            GetSediPartenze getSediPartenze, NotificationAggiornaBox notificationAggiornaBox)
        {
            _getGerarchiaToSend = new GetGerarchiaToSend(getAlberaturaUnitaOperative);
            _mapperSintesi = mapperSintesi;
            _getSediPartenze = getSediPartenze;
            _notificationAggiornaBox = notificationAggiornaBox;
            _notificationHubContext = notificationHubContext;
        }

        public async Task SendNotification(ModificaPartenzaCommand command)
        {
            var SediDaNotificare = new List<string>();
            if (command.Richiesta.CodSOAllertate != null)
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente, command.Richiesta.CodSOAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente);

            SediDaNotificare.AddRange(_getSediPartenze.GetFromRichiesta(command.Richiesta));

            var confermaPartenza = new ConfermaPartenze()
            {
                CodiceSede = command.CodSede.First(),
                IdOperatore = command.IdOperatore,
                IdRichiesta = command.Richiesta.Id,
                Chiamata = _mapperSintesi.Map(command.Richiesta),
                Partenze = command.Richiesta.lstPartenze,
                richiesta = command.Richiesta
            };

            Parallel.ForEach(SediDaNotificare.Distinct(), sede =>
            {
                _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", confermaPartenza);

                foreach (var partenza in command.Richiesta.lstPartenze)
                {
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyUpdateMezzoInServizio", new MezzoInServizio()
                    {
                        Mezzo = new MezzoMarker()
                        {
                            Mezzo = partenza.Mezzo,
                            InfoRichiesta = new InfoRichiesta()
                            {
                                CodiceRichiesta = command.Richiesta.Codice,
                                Indirizzo = command.Richiesta.Localita.Indirizzo
                            }
                        },
                        Squadre = partenza.Squadre
                    });
                }
            });

            var res = Task.Factory.StartNew(() =>
            {
                _notificationAggiornaBox.SendNotification(SediDaNotificare);
            });
        }
    }
}
