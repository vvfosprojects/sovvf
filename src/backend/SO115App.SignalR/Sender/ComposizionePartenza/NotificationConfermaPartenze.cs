﻿//-----------------------------------------------------------------------
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
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.SignalR.Utility;
using System.Data;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System.Collections.Generic;
using SO115App.API.Models.Classi.Condivise;

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
        private readonly MapperRichiestaAssistenzaSuSintesi _mapperSintesi;
        private readonly IGetRichiestaById _getRichiestaById;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoUC;

        public NotificationConfermaPartenze(IHubContext<NotificationHub> notificationHubContext,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiestehandler,
            IQueryHandler<BoxMezziQuery, BoxMezziResult> boxMezzihandler,
            IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> boxPersonalehandler,
            IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> sintesiRichiesteAssistenzaMarkerhandler,
            IMapper mapper,
            IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteHandler,
            IGetTipologieByCodice getTipologieByCodice, MapperRichiestaAssistenzaSuSintesi mapperSintesi,
            IGetRichiestaById getRichiestaById, GetGerarchiaToSend getGerarchiaToSend, IGetDistaccamentoByCodiceSedeUC getDistaccamentoUC)
        {
            _getGerarchiaToSend = getGerarchiaToSend;
            _getDistaccamentoUC = getDistaccamentoUC;
            _notificationHubContext = notificationHubContext;
            _boxRichiestehandler = boxRichiestehandler;
            _boxMezzihandler = boxMezzihandler;
            _boxPersonalehandler = boxPersonalehandler;
            _sintesiRichiesteAssistenzaMarkerhandler = sintesiRichiesteAssistenzaMarkerhandler;
            _mapper = mapper;
            _sintesiRichiesteHandler = sintesiRichiesteHandler;
            _getTipologieByCodice = getTipologieByCodice;
            _mapperSintesi = mapperSintesi;
            _getRichiestaById = getRichiestaById;
            _getDistaccamentoUC = getDistaccamentoUC;
        }

        public async Task SendNotification(ConfermaPartenzeCommand conferma)
        {
            const bool notificaChangeState = true;

            var richiesta = _getRichiestaById.GetByCodice(conferma.ConfermaPartenze.IdRichiesta);
            var sintesi = _mapperSintesi.Map(richiesta);
            sintesi.Competenze = MapCompetenze(richiesta.CodUOCompetenza);
            conferma.ConfermaPartenze.Chiamata = sintesi;

            //Sedi gerarchicamente superiori alla richiesta che dovanno ricevere la notifica
            var SediDaNotificare = _getGerarchiaToSend.Get(richiesta.CodSOCompetente);

            //Sedi dei mezzi in partenza che dovranno ricevere la notifica
            foreach (var partenza in conferma.ConfermaPartenze.Partenze)
            {
                SediDaNotificare.Add(partenza.Mezzo.Distaccamento.Codice);
            }

            sintesi.Motivazione = sintesi.Descrizione;

            foreach (var sede in SediDaNotificare)
            {
                var boxRichiesteQuery = new BoxRichiesteQuery()
                {
                    CodiciSede = new string[] { sede }
                };
                var boxMezziQuery = new BoxMezziQuery()
                {
                    CodiciSede = new string[] { sede }
                };
                var boxPersonaleQuery = new BoxPersonaleQuery()
                {
                    CodiciSede = new string[] { sede }
                };
                var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery
                {
                    Filtro = new FiltroRicercaRichiesteAssistenza
                    {
                        idOperatore = conferma.ConfermaPartenze.IdOperatore
                    },
                    CodiciSede = new string[] { sede }
                };

                var sintesiRichiesteAssistenzaMarkerQuery = new SintesiRichiesteAssistenzaMarkerQuery()
                {
                    CodiciSedi = new string[] { sede }
                };

                var boxInterventi = _boxRichiestehandler.Handle(boxRichiesteQuery).BoxRichieste;
                var boxMezzi = _boxMezzihandler.Handle(boxMezziQuery).BoxMezzi;
                var boxPersonale = _boxPersonalehandler.Handle(boxPersonaleQuery).BoxPersonale;
                var sintesiRichieste = _sintesiRichiesteHandler.Handle(sintesiRichiesteAssistenzaQuery).SintesiRichiesta;
                var listaSintesiMarker = _sintesiRichiesteAssistenzaMarkerhandler.Handle(sintesiRichiesteAssistenzaMarkerQuery).SintesiRichiestaMarker;

                await _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", conferma.ConfermaPartenze);

                if (conferma.ConfermaPartenze.IdRichiestaDaSganciare != null)
                {
                    var richiestaSganciata = _getRichiestaById.GetByCodice(conferma.ConfermaPartenze.IdRichiestaDaSganciare);
                    var sintesiSganciata = _mapperSintesi.Map(richiesta);
                    sintesiSganciata.Competenze = MapCompetenze(richiesta.CodUOCompetenza);
                    conferma.ConfermaPartenze.Chiamata = sintesi;
                    await _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", conferma.ConfermaPartenze);
                }

                await _notificationHubContext.Clients.Group(sede).SendAsync("ChangeStateSuccess", notificaChangeState);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxMezzi", boxMezzi);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxPersonale", boxPersonale);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetRichiestaMarker", listaSintesiMarker.LastOrDefault(marker => marker.CodiceRichiesta == sintesi.CodiceRichiesta));
            }
        }

        private List<Sede> MapCompetenze(string[] codUOCompetenza)
        {
            var listaSedi = new List<Sede>();
            int i = 1;
            foreach (var codCompetenza in codUOCompetenza)
            {
                if (i <= 3)
                {
                    var Distaccamento = _getDistaccamentoUC.Get(codCompetenza).Result;
                    Sede sede = Distaccamento == null ? null : new Sede(codCompetenza, Distaccamento.DescDistaccamento, Distaccamento.Indirizzo, Distaccamento.Coordinate, "", "", "", "", "");
                    listaSedi.Add(sede);
                }

                i++;
            }

            return listaSedi;
        }
    }
}
