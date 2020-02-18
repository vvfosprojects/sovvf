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
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.Models.Servizi.CustomMapper;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza;
using System.Linq;
using System.Threading.Tasks;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;

namespace SO115App.SignalR.Sender.ComposizionePartenza
{
    public class NotificationConfermaPartenze : INotificationConfermaPartenze
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiestehandler;
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _boxMezzihandler;
        private readonly IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> _boxPersonalehandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _sintesiRichiesteAssistenzaMarkerhandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> _sintesiRichiesteHandler;
        private readonly IMapper _mapper;
        private readonly IGetTipologieByCodice _getTipologieByCodice;

        public NotificationConfermaPartenze(IHubContext<NotificationHub> notificationHubContext,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiestehandler,
            IQueryHandler<BoxMezziQuery, BoxMezziResult> boxMezzihandler,
            IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> boxPersonalehandler,
            IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> sintesiRichiesteAssistenzaMarkerhandler,
            IMapper mapper,
            IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteHandler, IGetTipologieByCodice getTipologieByCodice)
        {
            _notificationHubContext = notificationHubContext;
            _boxRichiestehandler = boxRichiestehandler;
            _boxMezzihandler = boxMezzihandler;
            _boxPersonalehandler = boxPersonalehandler;
            _sintesiRichiesteAssistenzaMarkerhandler = sintesiRichiesteAssistenzaMarkerhandler;
            _mapper = mapper;
            _sintesiRichiesteHandler = sintesiRichiesteHandler;
            _getTipologieByCodice = getTipologieByCodice;
        }

        public async Task SendNotification(ConfermaPartenzeCommand conferma)
        {
            var mapper = new MapperRichiestaAssistenzaSuSintesi(_mapper, _getTipologieByCodice);
            const bool notificaChangeState = true;

            var richiesta = conferma.ConfermaPartenze.richiesta;
            var sintesi = mapper.Map(richiesta);

            sintesi.Motivazione = sintesi.Descrizione;

            var boxRichiesteQuery = new BoxRichiesteQuery();
            var boxMezziQuery = new BoxMezziQuery()
            {
                CodiceSede = conferma.ConfermaPartenze.CodiceSede
            };
            var boxPersonaleQuery = new BoxPersonaleQuery();
            var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery
            {
                Filtro = new FiltroRicercaRichiesteAssistenza
                {
                    idOperatore = conferma.ConfermaPartenze.IdOperatore
                }
            };

            var sintesiRichiesteAssistenzaMarkerQuery = new SintesiRichiesteAssistenzaMarkerQuery();
            var boxInterventi = _boxRichiestehandler.Handle(boxRichiesteQuery).BoxRichieste;
            var boxMezzi = _boxMezzihandler.Handle(boxMezziQuery).BoxMezzi;
            var boxPersonale = _boxPersonalehandler.Handle(boxPersonaleQuery).BoxPersonale;
            var sintesiRichieste = _sintesiRichiesteHandler.Handle(sintesiRichiesteAssistenzaQuery).SintesiRichiesta;
            var listaSintesiMarker = _sintesiRichiesteAssistenzaMarkerhandler.Handle(sintesiRichiesteAssistenzaMarkerQuery).SintesiRichiestaMarker;

            conferma.ConfermaPartenze.Chiamata = sintesi;

            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("ModifyAndNotifySuccess", conferma.ConfermaPartenze);

            if (conferma.ConfermaPartenze.IdRichiestaDaSganciare != null)
            {
                conferma.ConfermaPartenze.Chiamata = sintesiRichieste.LastOrDefault(x => x.Codice == conferma.ConfermaPartenze.IdRichiesta);
                await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("ModifyAndNotifySuccess", conferma.ConfermaPartenze);
                conferma.ConfermaPartenze.Chiamata = sintesiRichieste.LastOrDefault(x => x.Codice == conferma.ConfermaPartenze.IdRichiestaDaSganciare);
                await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("ModifyAndNotifySuccess", conferma.ConfermaPartenze);
            }

            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("ChangeStateSuccess", notificaChangeState);
            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("NotifyGetBoxMezzi", boxMezzi);
            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("NotifyGetBoxPersonale", boxPersonale);
            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("NotifyGetRichiestaMarker", listaSintesiMarker.LastOrDefault(marker => marker.CodiceRichiesta == sintesi.CodiceRichiesta));
        }
    }
}
