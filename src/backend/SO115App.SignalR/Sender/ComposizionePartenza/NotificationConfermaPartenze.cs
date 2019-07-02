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
            MapperRichiestaAssistenzaSuSintesi Mapper = new MapperRichiestaAssistenzaSuSintesi(_mapper);

            SintesiRichiesta sintesi = new SintesiRichiesta();
            RichiestaAssistenza richiesta = conferma.ConfermaPartenze.richiesta;
            sintesi = Mapper.Map(richiesta);

            sintesi.Motivazione = sintesi.Descrizione;
            //sintesi.Stato = "Assegnata";
            //sintesi.Priorita = richiesta.PrioritaRichiesta;

            var BoxRichiestequery = new BoxRichiesteQuery();
            var BoxMezziquery = new BoxMezziQuery();
            var BoxPersonaleQuery = new BoxPersonaleQuery();
            BoxInterventi boxInterventi = new BoxInterventi();
            BoxMezzi boxMezzi = new BoxMezzi();
            BoxPersonale boxPersonale = new BoxPersonale();
            boxInterventi = (BoxInterventi)this._BoxRichiestehandler.Handle(BoxRichiestequery).BoxRichieste;
            boxMezzi = (BoxMezzi)this._BoxMezzihandler.Handle(BoxMezziquery).BoxMezzi;
            boxPersonale = (BoxPersonale)this._boxPersonalehandler.Handle(BoxPersonaleQuery).BoxPersonale;

            boxMezzi.InViaggio = boxMezzi.InViaggio + sintesi.Partenze.Select(x => x.Partenza.Mezzo).Count();
            boxMezzi.InSede = boxMezzi.InSede - sintesi.Partenze.Select(x => x.Partenza.Mezzo).Count();

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
