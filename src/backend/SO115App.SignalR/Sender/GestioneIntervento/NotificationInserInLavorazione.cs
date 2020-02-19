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
using DomainModel.CQRS.Commands.MessaInLavorazione;
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
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneIntervento;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneIntervento
{
    public class NotificationInserInLavorazione : INotifyMessaInLavorazioneRichiesta
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _BoxRichiestehandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _SintesiRichiesteAssistenzaMarkerhandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteAssistenzahandler;

        public NotificationInserInLavorazione(IHubContext<NotificationHub> NotificationHubContext,
                                          IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> BoxRichiestehandler,
                                          IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> SintesiRichiesteAssistenzaMarkerhandler,
                                          IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> SintesiRichiesteAssistenzahandler
            )
        {
            _notificationHubContext = NotificationHubContext;
            _BoxRichiestehandler = BoxRichiestehandler;
            _SintesiRichiesteAssistenzaMarkerhandler = SintesiRichiesteAssistenzaMarkerhandler;
            sintesiRichiesteAssistenzahandler = SintesiRichiesteAssistenzahandler;
        }

        public async Task SendNotification(MessaInLavorazioneCommand intervento)
        {
            var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery
            {
                Filtro = new FiltroRicercaRichiesteAssistenza
                {
                    idOperatore = intervento.IdUtente
                }
            };
            var listaSintesi = (List<SintesiRichiesta>)this.sintesiRichiesteAssistenzahandler.Handle(sintesiRichiesteAssistenzaQuery).SintesiRichiesta;

            intervento.Chiamata = listaSintesi.LastOrDefault(richiesta => richiesta.Id == intervento.Chiamata.Id);

            await _notificationHubContext.Clients.Group(intervento.Chiamata.Operatore.Sede.Codice).SendAsync("ModifyAndNotifySuccess", intervento);
        }
    }
}
