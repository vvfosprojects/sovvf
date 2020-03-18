//-----------------------------------------------------------------------
// <copyright file="NotificationUpDateChiamata.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------

using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza;
using System.Linq;
using System.Threading.Tasks;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneMezziInServizio.ListaMezziInSerivizio;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.MezziMarker;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;

namespace SO115App.SignalR.Sender.GestionePartenza
{
    public class NotificationAggiornaStatoMezzo : INotifyAggiornaStatoMezzo
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _boxMezziHandler;
        private readonly IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> _boxPersonaleHandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _sintesiRichiesteAssistenzaMarkerhandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> _sintesiRichiesteAssistenzahandler;
        private readonly IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> _listaMezziInServizioHandler;
        private readonly IQueryHandler<MezziMarkerQuery, MezziMarkerResult> _listaMezziMarkerHandler;

        public NotificationAggiornaStatoMezzo(IHubContext<NotificationHub> notificationHubContext,
                                          IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
                                          IQueryHandler<BoxMezziQuery, BoxMezziResult> boxMezziHandler,
                                          IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> boxPersonaleHandler,
                                          IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> sintesiRichiesteAssistenzaMarkerhandler,
                                          IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteAssistenzahandler,
                                          IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> listaMezziInServizioHandler,
                                          IQueryHandler<MezziMarkerQuery, MezziMarkerResult> listaMezziMarkerHandler)
        {
            _notificationHubContext = notificationHubContext;
            _boxRichiesteHandler = boxRichiesteHandler;
            _boxMezziHandler = boxMezziHandler;
            _boxPersonaleHandler = boxPersonaleHandler;
            _sintesiRichiesteAssistenzaMarkerhandler = sintesiRichiesteAssistenzaMarkerhandler;
            _sintesiRichiesteAssistenzahandler = sintesiRichiesteAssistenzahandler;
            _listaMezziInServizioHandler = listaMezziInServizioHandler;
            _listaMezziMarkerHandler = listaMezziMarkerHandler;
        }

        public async Task SendNotification(AggiornaStatoMezzoCommand intervento)
        {
            const bool notificaChangeState = true;
            var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery
            {
                Filtro = new FiltroRicercaRichiesteAssistenza
                {
                    idOperatore = intervento.IdUtente
                },
                CodiciSede = new string[] { intervento.CodiceSede }
            };
            var listaSintesi = _sintesiRichiesteAssistenzahandler.Handle(sintesiRichiesteAssistenzaQuery).SintesiRichiesta;

            var boxRichiesteQuery = new BoxRichiesteQuery()
            {
                CodiciSede = new string[] { intervento.CodiceSede }
            };
            var boxInterventi = _boxRichiesteHandler.Handle(boxRichiesteQuery).BoxRichieste;

            var boxMezziQuery = new BoxMezziQuery()
            {
                CodiciSede = new string[] { intervento.CodiceSede }
            };
            var boxMezzi = _boxMezziHandler.Handle(boxMezziQuery).BoxMezzi;

            var boxPersonaleQuery = new BoxPersonaleQuery()
            {
                CodiciSede = new string[] { intervento.CodiceSede }
            };
            var boxPersonale = _boxPersonaleHandler.Handle(boxPersonaleQuery).BoxPersonale;

            var listaMezziInServizioQuery = new ListaMezziInServizioQuery
            {
                IdSede = intervento.CodiceSede
            };
            var listaMezziInServizio = _listaMezziInServizioHandler.Handle(listaMezziInServizioQuery).ListaMezzi;

            var sintesiRichiesteAssistenzaMarkerQuery = new SintesiRichiesteAssistenzaMarkerQuery()
            {
                CodiciSedi = new string[] { intervento.CodiceSede }
            };

            var listaSintesiMarker = _sintesiRichiesteAssistenzaMarkerhandler.Handle(sintesiRichiesteAssistenzaMarkerQuery).SintesiRichiestaMarker;

            intervento.Chiamata = listaSintesi.LastOrDefault(richiesta => richiesta.Id == intervento.Chiamata.Id);

            await _notificationHubContext.Clients.Group(intervento.CodiceSede).SendAsync("ModifyAndNotifySuccess", intervento);
            await _notificationHubContext.Clients.Group(intervento.CodiceSede).SendAsync("ChangeStateSuccess", notificaChangeState);
            await _notificationHubContext.Clients.Group(intervento.CodiceSede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
            await _notificationHubContext.Clients.Group(intervento.CodiceSede).SendAsync("NotifyGetBoxMezzi", boxMezzi);
            await _notificationHubContext.Clients.Group(intervento.CodiceSede).SendAsync("NotifyGetBoxPersonale", boxPersonale);
            await _notificationHubContext.Clients.Group(intervento.CodiceSede).SendAsync("NotifyGetListaMezziInServizio", listaMezziInServizio);
            await _notificationHubContext.Clients.Group(intervento.CodiceSede).SendAsync("NotifyGetRichiestaUpDateMarker", listaSintesiMarker.LastOrDefault(marker => marker.Codice == intervento.Chiamata.Codice));

            var queryListaMezzi = new MezziMarkerQuery();
            var listaMezziMarker = _listaMezziMarkerHandler.Handle(queryListaMezzi).ListaMezziMarker;
            await _notificationHubContext.Clients.Group(intervento.CodiceSede).SendAsync("NotifyGetMezzoUpDateMarker", listaMezziMarker.LastOrDefault(marker => marker.Mezzo.IdRichiesta == intervento.Chiamata.Codice));
        }
    }
}
