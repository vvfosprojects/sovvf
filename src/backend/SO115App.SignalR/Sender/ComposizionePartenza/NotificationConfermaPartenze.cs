//-----------------------------------------------------------------------
// <copyright file="NotificationAddPrenotazioneMezzo.cs" company="CNVVF">
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
using DomainModel.CQRS.Commands.ConfermaPartenze;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.Models.Servizi.CustomMapper;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.ComposizionePartenza
{
    public class NotificationConfermaPartenze : INotificationConfermaPartenze
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _BoxRichiestehandler;
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _BoxMezzihandler;
        private readonly IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> _boxPersonalehandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _sintesiRichiesteAssistenzaMarkerhandler;
        private readonly IMapper _mapper;

        public NotificationConfermaPartenze(IHubContext<NotificationHub> NotificationHubContext,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> BoxRichiestehandler,
            IQueryHandler<BoxMezziQuery, BoxMezziResult> BoxMezzihandler,
            IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> BoxPersonalehandler,
            IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> SintesiRichiesteAssistenzaMarkerhandler,
            IMapper mapper)
        {
            _notificationHubContext = NotificationHubContext;
            _BoxRichiestehandler = BoxRichiestehandler;
            _BoxMezzihandler = BoxMezzihandler;
            _boxPersonalehandler = BoxPersonalehandler;
            _sintesiRichiesteAssistenzaMarkerhandler = SintesiRichiesteAssistenzaMarkerhandler;
            _mapper = mapper;
        }

        public async Task SendNotification(ConfermaPartenzeCommand conferma)
        {
            var mapper = new MapperRichiestaAssistenzaSuSintesi(_mapper);

            var sintesi = new SintesiRichiesta();
            var richiesta = conferma.ConfermaPartenze.richiesta;
            sintesi = mapper.Map(richiesta);

            sintesi.Motivazione = sintesi.Descrizione;
            //sintesi.Stato = "Assegnata";
            //sintesi.Priorita = richiesta.PrioritaRichiesta;

            var boxRichiesteQuery = new BoxRichiesteQuery();
            var boxMezziQuery = new BoxMezziQuery();
            var boxPersonaleQuery = new BoxPersonaleQuery();
            var boxInterventi = new BoxInterventi();
            var boxMezzi = new BoxMezzi();
            var boxPersonale = new BoxPersonale();

            boxInterventi = (BoxInterventi)this._BoxRichiestehandler.Handle(boxRichiesteQuery).BoxRichieste;
            boxMezzi = (BoxMezzi)this._BoxMezzihandler.Handle(boxMezziQuery).BoxMezzi;
            boxPersonale = (BoxPersonale)this._boxPersonalehandler.Handle(boxPersonaleQuery).BoxPersonale;


            boxPersonale.SquadreAssegnate = boxPersonale.SquadreAssegnate + sintesi.Partenze.Select(x => x.Partenza.Squadre).Count();

            conferma.ConfermaPartenze.Chiamata = sintesi;

            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("ModifyAndNotifySuccess", conferma.ConfermaPartenze);
            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("NotifyGetBoxMezzi", boxMezzi);
            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("NotifyGetBoxPersonale", boxPersonale);

            var query = new SintesiRichiesteAssistenzaMarkerQuery();
            List<SintesiRichiestaMarker> listaSintesiMarker = new List<SintesiRichiestaMarker>();
            listaSintesiMarker = (List<SintesiRichiestaMarker>)this._sintesiRichiesteAssistenzaMarkerhandler.Handle(query).SintesiRichiestaMarker;
            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("NotifyGetRichiestaMarker", listaSintesiMarker.LastOrDefault(marker => marker.CodiceRichiesta == sintesi.CodiceRichiesta));
        }
    }
}
