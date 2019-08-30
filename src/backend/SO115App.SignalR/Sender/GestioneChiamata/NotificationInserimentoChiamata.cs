//-----------------------------------------------------------------------
// <copyright file="NotificationInserimentoChiamata.cs" company="CNVVF">
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
using DomainModel.CQRS.Commands.AddIntervento;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamata;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneChiamata
{
    public class NotificationInserimentoChiamata : INotifyInserimentoChiamata
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _sintesiRichiesteAssistenzaMarkerHandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> _sintesiRichiesteAssistenzaHandler;

        public NotificationInserimentoChiamata(IHubContext<NotificationHub> notificationHubContext,
                                               IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
                                               IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> sintesiRichiesteAssistenzaMarkerHandler,
                                               IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteAssistenzaHandler)
        {
            _notificationHubContext = notificationHubContext;
            _boxRichiesteHandler = boxRichiesteHandler;
            _sintesiRichiesteAssistenzaMarkerHandler = sintesiRichiesteAssistenzaMarkerHandler;
            _sintesiRichiesteAssistenzaHandler = sintesiRichiesteAssistenzaHandler;
        }

        public async Task SendNotification(AddInterventoCommand intervento)
        {
            var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery();
            var listaSintesi = (List<SintesiRichiesta>)this._sintesiRichiesteAssistenzaHandler.Handle(sintesiRichiesteAssistenzaQuery).SintesiRichiesta;

            var boxRichiesteQuery = new BoxRichiesteQuery();
            var boxInterventi = (BoxInterventi)this._boxRichiesteHandler.Handle(boxRichiesteQuery).BoxRichieste;

            var query = new SintesiRichiesteAssistenzaMarkerQuery();

            var sintesi = listaSintesi.LastOrDefault(richiesta => richiesta.Codice == intervento.Chiamata.Codice);
            sintesi.Motivazione = sintesi.Descrizione;

            await _notificationHubContext.Clients.Group(intervento.Chiamata.Operatore.Sede.Codice).SendAsync("SaveAndNotifySuccessChiamata", sintesi);
            await _notificationHubContext.Clients.Group(intervento.Chiamata.Operatore.Sede.Codice).SendAsync("NotifyGetBoxInterventi", boxInterventi);

            var listaSintesiMarker = (List<SintesiRichiestaMarker>)this._sintesiRichiesteAssistenzaMarkerHandler.Handle(query).SintesiRichiestaMarker;

            await _notificationHubContext.Clients.Group(intervento.Chiamata.Operatore.Sede.Codice).SendAsync("NotifyGetRichiestaMarker", listaSintesiMarker.LastOrDefault(marker => marker.Codice == intervento.Chiamata.Codice));
        }
    }
}
