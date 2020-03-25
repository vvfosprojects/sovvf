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
using DomainModel.CQRS.Commands.UpDateStatoRichiesta;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneIntervento;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneIntervento
{
    public class NotificationUpDateStato : INotifyUpDateStatoRichiesta
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _boxMezziHandler;
        private readonly IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> _boxPersonaleHandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _sintesiRichiesteAssistenzaMarkerHandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> _sintesiRichiesteAssistenzaHandler;

        public NotificationUpDateStato(IHubContext<NotificationHub> notificationHubContext,
                                          IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
                                          IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> sintesiRichiesteAssistenzaMarkerHandler,
                                          IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteAssistenzaHandler,
                                          IQueryHandler<BoxMezziQuery, BoxMezziResult> boxMezziHandler,
                                          IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> boxPersonaleHandler)
        {
            _notificationHubContext = notificationHubContext;
            _boxRichiesteHandler = boxRichiesteHandler;
            _sintesiRichiesteAssistenzaMarkerHandler = sintesiRichiesteAssistenzaMarkerHandler;
            _sintesiRichiesteAssistenzaHandler = sintesiRichiesteAssistenzaHandler;
            _boxMezziHandler = boxMezziHandler;
            _boxPersonaleHandler = boxPersonaleHandler;
        }

        public async Task SendNotification(UpDateStatoRichiestaCommand richiesta)
        {
            const bool notificaChangeState = true;
            var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery
            {
                Filtro = new FiltroRicercaRichiesteAssistenza
                {
                    idOperatore = richiesta.IdOperatore
                },
                CodiciSede = new string[] { richiesta.CodiceSede }
            };
            var boxRichiesteQuery = new BoxRichiesteQuery()
            {
                CodiciSede = new string[] { richiesta.CodiceSede }
            };
            var boxInterventi = _boxRichiesteHandler.Handle(boxRichiesteQuery).BoxRichieste;

            var boxMezziQuery = new BoxMezziQuery()
            {
                CodiciSede = new string[] { richiesta.CodiceSede }
            };
            var boxMezzi = _boxMezziHandler.Handle(boxMezziQuery).BoxMezzi;

            var boxPersonaleQuery = new BoxPersonaleQuery()
            {
                CodiciSede = new string[] { richiesta.CodiceSede }
            };
            var boxPersonale = _boxPersonaleHandler.Handle(boxPersonaleQuery).BoxPersonale;

            var sintesiRichiesteAssistenzaMarkerQuery = new SintesiRichiesteAssistenzaMarkerQuery()
            {
                CodiciSedi = new string[] { richiesta.CodiceSede }
            };

            var listaSintesiMarker = (List<SintesiRichiestaMarker>)_sintesiRichiesteAssistenzaMarkerHandler.Handle(sintesiRichiesteAssistenzaMarkerQuery).SintesiRichiestaMarker;
            var ChamataUpd = listaSintesiMarker.LastOrDefault(sintesi => sintesi.Id == richiesta.IdRichiesta);

            await _notificationHubContext.Clients.Group(richiesta.CodiceSede).SendAsync("ModifyAndNotifySuccess", richiesta);
            await _notificationHubContext.Clients.Group(richiesta.CodiceSede).SendAsync("ChangeStateSuccess", notificaChangeState);
            await _notificationHubContext.Clients.Group(richiesta.CodiceSede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
            await _notificationHubContext.Clients.Group(richiesta.CodiceSede).SendAsync("NotifyGetBoxMezzi", boxMezzi);
            await _notificationHubContext.Clients.Group(richiesta.CodiceSede).SendAsync("NotifyGetBoxPersonale", boxPersonale);
            await _notificationHubContext.Clients.Group(richiesta.CodiceSede).SendAsync("NotifyGetRichiestaUpDateMarker", ChamataUpd);
        }
    }
}
