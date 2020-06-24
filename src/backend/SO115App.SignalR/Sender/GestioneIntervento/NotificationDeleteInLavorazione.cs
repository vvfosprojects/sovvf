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
using DomainModel.CQRS.Commands.RimozioneInLavorazione;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneIntervento;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneIntervento
{
    public class NotificationDeleteInLavorazione : INotifyDeleteInLavorazioneRichiesta
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetRichiesteMarker _iGetListaRichieste;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationDeleteInLavorazione(IHubContext<NotificationHub> notificationHubContext,
                                          IGetRichiesteMarker iGetListaRichieste,
                                          GetGerarchiaToSend getGerarchiaToSend
            )
        {
            _notificationHubContext = notificationHubContext;
            _iGetListaRichieste = iGetListaRichieste;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        public async Task SendNotification(RimozioneInLavorazioneCommand intervento)
        {
            var SediDaNotificare = _getGerarchiaToSend.Get(intervento.CodSede);

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

                var sintesiRichiesteAssistenzaMarkerQuery = new SintesiRichiesteAssistenzaMarkerQuery()
                {
                    CodiciSedi = new string[] { sede }
                };

                var listaSintesiMarker = _iGetListaRichieste.GetListaRichiesteMarker(sintesiRichiesteAssistenzaMarkerQuery);
                await _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", intervento);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetRichiestaUpDateMarker", listaSintesiMarker.LastOrDefault(marker => marker.Codice == intervento.Chiamata.Codice));
            }
        }
    }
}
