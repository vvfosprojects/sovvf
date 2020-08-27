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
using DomainModel.CQRS.Commands.RimozionePresaInCarico;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneIntervento;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneIntervento
{
    public class NotificationDeletePresaInCarico : INotifyDeletePresaInCaricoRichiesta
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _sintesiRichiesteAssistenzaMarkerHandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> _sintesiRichiesteAssistenzaHandler;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationDeletePresaInCarico(IHubContext<NotificationHub> notificationHubContext,
                                          IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
                                          IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> sintesiRichiesteAssistenzaMarkerHandler,
                                          IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteAssistenzaHandler,
                                          GetGerarchiaToSend getGerarchiaToSend)
        {
            _notificationHubContext = notificationHubContext;
            _boxRichiesteHandler = boxRichiesteHandler;
            _sintesiRichiesteAssistenzaMarkerHandler = sintesiRichiesteAssistenzaMarkerHandler;
            _sintesiRichiesteAssistenzaHandler = sintesiRichiesteAssistenzaHandler;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        public async Task SendNotification(RimozionePresaInCaricoCommand intervento)
        {
            var SediDaNotificare = new List<string>();
            if (intervento.Chiamata.CodSOAllertate != null)
                SediDaNotificare = _getGerarchiaToSend.Get(intervento.Chiamata.CodSOCompetente, intervento.Chiamata.CodSOAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(intervento.Chiamata.CodSOCompetente);

            foreach (var sede in SediDaNotificare)
            {
                var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery
                {
                    Filtro = new FiltroRicercaRichiesteAssistenza
                    {
                        idOperatore = intervento.IdUtente
                    },
                    CodiciSede = new string[] { sede }
                };
                var listaSintesi = (List<SintesiRichiesta>)this._sintesiRichiesteAssistenzaHandler.Handle(sintesiRichiesteAssistenzaQuery).SintesiRichiesta;
                intervento.Chiamata = listaSintesi.LastOrDefault(richiesta => richiesta.Id == intervento.Chiamata.Id);

                //var boxRichiestequery = new BoxRichiesteQuery()
                //{
                //    CodiciSede = new string[] { sede }
                //};
                //var boxInterventi = (BoxInterventi)this._boxRichiesteHandler.Handle(boxRichiestequery).BoxRichieste;
                //await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);

                var sintesiRichiesteAssistenzaMarkerQuery = new SintesiRichiesteAssistenzaMarkerQuery()
                {
                    CodiciSedi = new string[] { sede }
                };

                var listaSintesiMarker = (List<SintesiRichiestaMarker>)this._sintesiRichiesteAssistenzaMarkerHandler.Handle(sintesiRichiesteAssistenzaMarkerQuery).SintesiRichiestaMarker;

                await _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", intervento);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetRichiestaUpDateMarker", listaSintesiMarker.LastOrDefault(marker => marker.Codice == intervento.Chiamata.Codice));
            }
        }
    }
}
