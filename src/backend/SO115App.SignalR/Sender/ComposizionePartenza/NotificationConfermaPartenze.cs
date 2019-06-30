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
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
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
        private readonly IMapper _mapper;

        public NotificationConfermaPartenze(IHubContext<NotificationHub> NotificationHubContext, IQueryHandler<BoxRichiesteQuery,
            BoxRichiesteResult> BoxRichiestehandler,
            IQueryHandler<BoxMezziQuery, BoxMezziResult> BoxMezzihandler,
            IMapper mapper)
        {
            _notificationHubContext = NotificationHubContext;
            _BoxRichiestehandler = BoxRichiestehandler;
            _BoxMezzihandler = BoxMezzihandler;
            _mapper = mapper;
        }

        public async Task SendNotification(ConfermaPartenzeCommand conferma)
        {
            MapperRichiestaAssistenzaSuSintesi Mapper = new MapperRichiestaAssistenzaSuSintesi(_mapper);

            SintesiRichiesta sintesi = new SintesiRichiesta();
            RichiestaAssistenza richiesta = conferma.ConfermaPartenze.richiesta;
            sintesi = Mapper.Map(richiesta);

            sintesi.Motivazione = sintesi.Descrizione;
            sintesi.Stato = "Assegnata";
            sintesi.Priorita = richiesta.PrioritaRichiesta;

            var BoxRichiestequery = new BoxRichiesteQuery();
            var BoxMezziquery = new BoxMezziQuery();
            BoxInterventi boxInterventi = new BoxInterventi();
            BoxMezzi boxMezzi = new BoxMezzi();
            boxInterventi = (BoxInterventi)this._BoxRichiestehandler.Handle(BoxRichiestequery).BoxRichieste;
            boxMezzi = (BoxMezzi)this._BoxMezzihandler.Handle(BoxMezziquery).BoxMezzi;

            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("ModifyAndNotifySuccess", sintesi);
            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("NotifyGetBoxMezzi", boxMezzi);
        }
    }
}
