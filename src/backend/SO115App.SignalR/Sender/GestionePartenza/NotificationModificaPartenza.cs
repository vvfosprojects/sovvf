using AutoMapper;
using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza;
using SO115App.Models.Servizi.CustomMapper;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestionePartenza
{
    public class NotificationModificaPartenza : INotifyModificaPartenza
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        private readonly IGetRichiestaById _getRichiesta;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _boxMezziHandler;
        private readonly IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> _boxPersonaleHandler;

        public NotificationModificaPartenza(IHubContext<NotificationHub> notificationHubContext,
            IGetRichiestaById getRichiesta,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
            IQueryHandler<BoxMezziQuery, BoxMezziResult> boxMezziHandler,
            IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> boxPersonaleHandler)
        {
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = new GetGerarchiaToSend(getAlberaturaUnitaOperative);
            _getRichiesta = getRichiesta;
            _boxMezziHandler = boxMezziHandler;
            _boxPersonaleHandler = boxPersonaleHandler;
            _boxRichiesteHandler = boxRichiesteHandler;
        }

        public async Task SendNotification(ModificaPartenzaCommand command)
        {
            var richiesta = _getRichiesta.GetById(command.ModificaPartenza.CodRichiesta);

            var SediDaNotificare = new List<string>();
            if (richiesta.CodSOAllertate != null)
                SediDaNotificare = _getGerarchiaToSend.Get(richiesta.CodSOCompetente, richiesta.CodSOAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(richiesta.CodSOCompetente);

            var confermaPartenza = new ConfermaPartenze()
            {
                CodiceSede = command.CodSede,
                IdOperatore = command.IdOperatore,
                IdRichiesta = command.ModificaPartenza.CodRichiesta,
                Partenze = richiesta.lstPartenze,
                richiesta = richiesta
            };

            Parallel.ForEach(SediDaNotificare, sede =>
            {
                var boxInterventi = _boxRichiesteHandler.Handle(new BoxRichiesteQuery() { CodiciSede = new string[] { sede } }).BoxRichieste;
                var boxMezzi = _boxMezziHandler.Handle(new BoxMezziQuery() { CodiciSede = new string[] { sede } }).BoxMezzi;
                var boxPersonale = _boxPersonaleHandler.Handle(new BoxPersonaleQuery() { CodiciSede = new string[] { sede } }).BoxPersonale;

                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxMezzi", boxMezzi);
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxPersonale", boxPersonale);

                _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", confermaPartenza);
            });
        }
    }
}
