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
using DomainModel.CQRS.Commands.UpDateStatoRichiesta;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneIntervento;
using SO115App.SignalR.Utility;
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
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiById;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IGetRichiesta _getRichiestaAssistenzaById;
        private readonly IGetRichiesteMarker _iGetListaRichieste;

        public NotificationUpDateStato(IHubContext<NotificationHub> notificationHubContext,
                                          IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
                                          IQueryHandler<BoxMezziQuery, BoxMezziResult> boxMezziHandler,
                                          IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> boxPersonaleHandler,
                                          IGetSintesiRichiestaAssistenzaByCodice getSintesiById,
                                          GetGerarchiaToSend getGerarchiaToSend,
                                          IGetRichiesta getRichiestaAssistenzaById,
                                          IGetRichiesteMarker iGetListaRichieste)
        {
            _notificationHubContext = notificationHubContext;
            _boxRichiesteHandler = boxRichiesteHandler;
            _boxMezziHandler = boxMezziHandler;
            _boxPersonaleHandler = boxPersonaleHandler;
            _getSintesiById = getSintesiById;
            _getGerarchiaToSend = getGerarchiaToSend;
            _getRichiestaAssistenzaById = getRichiestaAssistenzaById;
            _iGetListaRichieste = iGetListaRichieste;
        }

        public async Task SendNotification(UpDateStatoRichiestaCommand command)
        {
            var Richiesta = _getRichiestaAssistenzaById.GetById(command.IdRichiesta);

            var SediDaNotificare = new List<string>();
            SediDaNotificare = _getGerarchiaToSend.Get(Richiesta.CodSOCompetente);

            const bool notificaChangeState = true;

            //AGGIORNO LE SEDI PRINCIPALI
            foreach (var sede in SediDaNotificare)
            {
                var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery
                {
                    Filtro = new FiltroRicercaRichiesteAssistenza
                    {
                        idOperatore = command.IdOperatore
                    },
                    CodiciSede = new string[] { sede }
                };
                var boxRichiesteQuery = new BoxRichiesteQuery()
                {
                    CodiciSede = new string[] { sede }
                };
                var boxInterventi = _boxRichiesteHandler.Handle(boxRichiesteQuery).BoxRichieste;

                var boxMezziQuery = new BoxMezziQuery()
                {
                    CodiciSede = new string[] { sede }
                };
                var boxMezzi = _boxMezziHandler.Handle(boxMezziQuery).BoxMezzi;

                var boxPersonaleQuery = new BoxPersonaleQuery()
                {
                    CodiciSede = new string[] { sede }
                };
                var boxPersonale = _boxPersonaleHandler.Handle(boxPersonaleQuery).BoxPersonale;

                var sintesiRichiesteAssistenzaMarkerQuery = new SintesiRichiesteAssistenzaMarkerQuery()
                {
                    CodiciSedi = new string[] { sede }
                };

                var ChiamataUpd = _iGetListaRichieste.GetListaRichiesteMarker(sintesiRichiesteAssistenzaMarkerQuery).LastOrDefault(sintesi => sintesi.Id == command.IdRichiesta);

                var SintesiRichiesta = _getSintesiById.GetSintesi(ChiamataUpd.Codice);
                command.Chiamata = SintesiRichiesta;

                await _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", command);
                await _notificationHubContext.Clients.Group(sede).SendAsync("ChangeStateSuccess", notificaChangeState);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxMezzi", boxMezzi);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxPersonale", boxPersonale);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetRichiestaUpDateMarker", ChiamataUpd);
            }

            if (Richiesta.CodSOAllertate != null)
            {
                //var SediAllertateDaNotificare = new List<string>();
                //SediAllertateDaNotificare = _getGerarchiaToSend.Get(Richiesta.CodSOAllertate.ToArray());

                foreach (var sede in Richiesta.CodSOAllertate)
                {
                    var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery
                    {
                        Filtro = new FiltroRicercaRichiesteAssistenza
                        {
                            idOperatore = command.IdOperatore
                        },
                        CodiciSede = new string[] { Richiesta.CodSOCompetente }
                    };

                    var sintesiRichiesteAssistenzaMarkerQuery = new SintesiRichiesteAssistenzaMarkerQuery()
                    {
                        CodiciSedi = new string[] { Richiesta.CodSOCompetente }
                    };

                    var ChiamataUpd = _iGetListaRichieste.GetListaRichiesteMarker(sintesiRichiesteAssistenzaMarkerQuery).LastOrDefault(sintesi => sintesi.Id == command.IdRichiesta);

                    var SintesiRichiesta = _getSintesiById.GetSintesi(ChiamataUpd.Codice);
                    command.Chiamata = SintesiRichiesta;

                    await _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", command);
                    await _notificationHubContext.Clients.Group(sede).SendAsync("ChangeStateSuccess", notificaChangeState);
                    await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetRichiestaUpDateMarker", ChiamataUpd);
                }
            }
        }
    }
}
