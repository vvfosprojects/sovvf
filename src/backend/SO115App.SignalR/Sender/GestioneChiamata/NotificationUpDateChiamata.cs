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

using AutoMapper;
using CQRS.Queries;
using DomainModel.CQRS.Commands.UpDateIntervento;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Servizi.CustomMapper;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamata;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneChiamata
{
    public class NotificationUpDateChiamata : INotifyUpDateChiamata
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _sintesiRichiesteAssistenzaMarkerHandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> _sintesiRichiesteAssistenzaHandler;
        private readonly IGetRichiestaById _getRichiestaById;

        public NotificationUpDateChiamata(IHubContext<NotificationHub> notificationHubContext,
                                          IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
                                          IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> sintesiRichiesteAssistenzaMarkerHandler,
                                          IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteAssistenzaHandler,
                                          IGetRichiestaById getRichiestaById)
        {
            _notificationHubContext = notificationHubContext;
            _boxRichiesteHandler = boxRichiesteHandler;
            _sintesiRichiesteAssistenzaMarkerHandler = sintesiRichiesteAssistenzaMarkerHandler;
            _sintesiRichiesteAssistenzaHandler = sintesiRichiesteAssistenzaHandler;
            _getRichiestaById = getRichiestaById;
        }

        public async Task SendNotification(UpDateInterventoCommand intervento)
        {
            var boxRichiesteQuery = new BoxRichiesteQuery()
            {
                CodiciSede = new string[] { intervento.CodiceSede }
            };

            var boxInterventi = _boxRichiesteHandler.Handle(boxRichiesteQuery).BoxRichieste;

            var sintesiRichiesteAssistenzaMarkerQuery = new SintesiRichiesteAssistenzaMarkerQuery()
            {
                CodiciSedi = new string[] { intervento.CodiceSede }
            };

            var listaSintesiMarker = (List<SintesiRichiestaMarker>)this._sintesiRichiesteAssistenzaMarkerHandler.Handle(sintesiRichiesteAssistenzaMarkerQuery).SintesiRichiestaMarker;

            var interventoUpdated = _getRichiestaById.GetById(intervento.Chiamata.Id);

            await _notificationHubContext.Clients.Group(intervento.CodiceSede).SendAsync("ModifyAndNotifySuccess", interventoUpdated);
            await _notificationHubContext.Clients.Group(intervento.CodiceSede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
            await _notificationHubContext.Clients.Group(intervento.CodiceSede).SendAsync("NotifyGetRichiestaUpDateMarker", listaSintesiMarker.LastOrDefault(marker => marker.Codice == intervento.Chiamata.Codice)).ConfigureAwait(false);
        }
    }
}
