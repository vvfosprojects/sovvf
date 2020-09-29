﻿using AutoMapper;
using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.Models.Classi.ListaMezziInServizio;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza;
using SO115App.Models.Servizi.CustomMapper;
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

        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _boxMezziHandler;
        private readonly IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> _boxPersonaleHandler;
        private readonly MapperRichiestaAssistenzaSuSintesi _mapperSintesi;

        public NotificationModificaPartenza(IHubContext<NotificationHub> notificationHubContext,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
            IQueryHandler<BoxMezziQuery, BoxMezziResult> boxMezziHandler,
            IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> boxPersonaleHandler,
            IMapper mapper, 
            IGetTipologieByCodice getTipologieByCodice, 
            IGetUtenteById getUtenteById)
        {
            _getGerarchiaToSend = new GetGerarchiaToSend(getAlberaturaUnitaOperative);
            _mapperSintesi = new MapperRichiestaAssistenzaSuSintesi(mapper, getTipologieByCodice, getUtenteById);
            _notificationHubContext = notificationHubContext;
            _boxMezziHandler = boxMezziHandler;
            _boxPersonaleHandler = boxPersonaleHandler;
            _boxRichiesteHandler = boxRichiesteHandler;
        }

        public async Task SendNotification(ModificaPartenzaCommand command)
        {
            var SediDaNotificare = new List<string>();
            if (command.Richiesta.CodSOAllertate != null)
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente, command.Richiesta.CodSOAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente);

            var confermaPartenza = new ConfermaPartenze()
            {
                CodiceSede = command.CodSede,
                IdOperatore = command.IdOperatore,
                IdRichiesta = command.Richiesta.Id,
                Chiamata =  _mapperSintesi.Map(command.Richiesta),
                Partenze = command.Richiesta.lstPartenze,
                richiesta = command.Richiesta
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
        }
    }
}
