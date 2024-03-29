﻿//-----------------------------------------------------------------------
// <copyright file="NotificationInserimentoChiamata.cs" company="CNVVF">
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
using DomainModel.CQRS.Commands.AddIntervento;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.Models.Classi.CodaChiamate;
using SO115App.Models.Classi.ServiziEsterni.NUE;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamata;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneChiamata
{
    public class NotificationInserimentoChiamata : INotifyInserimentoChiamata
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _sintesiRichiesteAssistenzaMarkerHandler;

        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IGetConteggioSchede _getConteggioSchede;

        public NotificationInserimentoChiamata(IHubContext<NotificationHub> notificationHubContext,
                                               IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
                                               IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> sintesiRichiesteAssistenzaMarkerHandler,
                                               GetGerarchiaToSend getGerarchiaToSend,
                                               IGetConteggioSchede getConteggioSchede)
        {
            _notificationHubContext = notificationHubContext;
            _boxRichiesteHandler = boxRichiesteHandler;
            _sintesiRichiesteAssistenzaMarkerHandler = sintesiRichiesteAssistenzaMarkerHandler;
            _getGerarchiaToSend = getGerarchiaToSend;
            _getConteggioSchede = getConteggioSchede;
        }

        public async Task SendNotification(AddInterventoCommand command)
        {
            var sedeComando = "";
            if (command.sintesi.CodSOCompetente.Contains("."))
                sedeComando = command.sintesi.CodSOCompetente.Split('.')[0] + ".1000";
            else
                sedeComando = command.sintesi.CodSOCompetente;

            var SediDaNotificare = _getGerarchiaToSend.Get(sedeComando, command.sintesi.CodUOCompetenza);

            SediDaNotificare.Add("00"); //AGGIUNGO IL CON ALLA NOTFICA

            var filtriSchedeContatto = new FiltriContatoriSchedeContatto()
            {
                Gestita = false
            };

            var infoNue = new InfoNue();
            if (!string.IsNullOrEmpty(command.Intervento.CodNue))
                infoNue = _getConteggioSchede.GetConteggio(new string[] { command.sintesi.CodSOCompetente.Split('.')[0] + ".1000" }, filtriSchedeContatto);

            Parallel.ForEach(SediDaNotificare, sede =>
        {
            var boxRichiesteQuery = new BoxRichiesteQuery
            {
                CodiciSede = new string[] { sede }
            };
            var boxInterventi = _boxRichiesteHandler.Handle(boxRichiesteQuery).BoxRichieste;

            var sintesiRichiesteAssistenzaMarkerQuery = new SintesiRichiesteAssistenzaMarkerQuery()
            {
                CodiciSedi = new string[] { sede }
            };
            var listaSintesiMarker = (List<SintesiRichiestaMarker>)_sintesiRichiesteAssistenzaMarkerHandler.Handle(sintesiRichiesteAssistenzaMarkerQuery).SintesiRichiestaMarker;

            var counterCodaChiamate = new CounterNotifica()
            {
                codDistaccamento = command.sintesi.Competenze != null && command.sintesi.Competenze.Count > 0 ? command.sintesi.Competenze[0].Codice : command.sintesi.CodSOCompetente,
                count = 1
            };

            if (!string.IsNullOrEmpty(command.Intervento.CodNue))
            {
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyUpdateSchedaContatto", true);
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifySetContatoriSchedeContatto", infoNue);
            }
            _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
            _notificationHubContext.Clients.Group(sede).SendAsync("SaveAndNotifySuccessChiamata", command.sintesi);
            _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetRichiestaMarker", listaSintesiMarker.LastOrDefault(marker => marker.Codice == command.Chiamata.Codice));
            _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddChiamateCodaChiamate", counterCodaChiamate);
        });
        }
    }
}
