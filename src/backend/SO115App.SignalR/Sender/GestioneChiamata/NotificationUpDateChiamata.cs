﻿//-----------------------------------------------------------------------
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
using DomainModel.CQRS.Commands.UpDateIntervento;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamata;
using SO115App.SignalR.Utility;
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
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiById;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly GetSediPartenze _getSediPartenze;

        public NotificationUpDateChiamata(IHubContext<NotificationHub> notificationHubContext,
                                          IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
                                          IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> sintesiRichiesteAssistenzaMarkerHandler,
                                          IGetSintesiRichiestaAssistenzaByCodice getSintesiById,
                                          GetGerarchiaToSend getGerarchiaToSend,
                                          GetSediPartenze getSediPartenze)
        {
            _notificationHubContext = notificationHubContext;
            _boxRichiesteHandler = boxRichiesteHandler;
            _sintesiRichiesteAssistenzaMarkerHandler = sintesiRichiesteAssistenzaMarkerHandler;
            _getSintesiById = getSintesiById;
            _getGerarchiaToSend = getGerarchiaToSend;
            _getSediPartenze = getSediPartenze;
        }

        public async Task SendNotification(UpDateInterventoCommand intervento)
        {
            var SintesiRichiesta = _getSintesiById.GetSintesi(intervento.Chiamata.Codice);
            intervento.sintesiRichiesta = SintesiRichiesta;

            var SediDaNotificare = _getGerarchiaToSend.Get(SintesiRichiesta.CodSOCompetente, SintesiRichiesta.CodSOAllertate.ToArray());

            SediDaNotificare.Add("00"); //AGGIUNGO IL CON ALLA NOTFICA

            if(SintesiRichiesta.CodSediPartenze!=null)
                SediDaNotificare.AddRange(SintesiRichiesta.CodSediPartenze);

            foreach (var sede in SediDaNotificare.Distinct())
            {
                var boxRichiesteQuery = new BoxRichiesteQuery()
                {
                    CodiciSede = new string[] { sede }
                };

                var boxInterventi = _boxRichiesteHandler.Handle(boxRichiesteQuery).BoxRichieste;

                var sintesiRichiesteAssistenzaMarkerQuery = new SintesiRichiesteAssistenzaMarkerQuery()
                {
                    CodiciSedi = new string[] { sede }
                };

                var listaSintesiMarker = (List<SintesiRichiestaMarker>)this._sintesiRichiesteAssistenzaMarkerHandler.Handle(sintesiRichiesteAssistenzaMarkerQuery).SintesiRichiestaMarker;
                await _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", intervento);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetRichiestaUpDateMarker", listaSintesiMarker.LastOrDefault(marker => marker.Codice == intervento.Chiamata.Codice)).ConfigureAwait(false);
            }
        }
    }
}
