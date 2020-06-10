//-----------------------------------------------------------------------
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
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.Matrix;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamata;
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
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiRichiestaByCodice;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly CallMatrix _callMatrix;

        public NotificationInserimentoChiamata(IHubContext<NotificationHub> notificationHubContext,
                                               IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
                                               IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> sintesiRichiesteAssistenzaMarkerHandler,
                                               IGetSintesiRichiestaAssistenzaByCodice getSintesiRichiestaByCodice,
                                               GetGerarchiaToSend getGerarchiaToSend,
                                               CallMatrix callMatrix)
        {
            _notificationHubContext = notificationHubContext;
            _boxRichiesteHandler = boxRichiesteHandler;
            _sintesiRichiesteAssistenzaMarkerHandler = sintesiRichiesteAssistenzaMarkerHandler;
            _getSintesiRichiestaByCodice = getSintesiRichiestaByCodice;
            _getGerarchiaToSend = getGerarchiaToSend;
            _callMatrix = callMatrix;
        }

        public async Task SendNotification(AddInterventoCommand intervento)
        {
            var sintesi = _getSintesiRichiestaByCodice.GetSintesi(intervento.Chiamata.Codice);

            var SediDaNotificare = _getGerarchiaToSend.Get(sintesi.CodSOCompetente);

            foreach (var sede in SediDaNotificare)
            {
                var boxRichiesteQuery = new BoxRichiesteQuery
                {
                    CodiciSede = new string[] { sede }
                };
                var boxInterventi = (BoxInterventi)this._boxRichiesteHandler.Handle(boxRichiesteQuery).BoxRichieste;

                var sintesiRichiesteAssistenzaMarkerQuery = new SintesiRichiesteAssistenzaMarkerQuery()
                {
                    CodiciSedi = new string[] { sede }
                };
                var listaSintesiMarker = (List<SintesiRichiestaMarker>)this._sintesiRichiesteAssistenzaMarkerHandler.Handle(sintesiRichiesteAssistenzaMarkerQuery).SintesiRichiestaMarker;

                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
                await _notificationHubContext.Clients.Group(sede).SendAsync("SaveAndNotifySuccessChiamata", sintesi);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetRichiestaMarker", listaSintesiMarker.LastOrDefault(marker => marker.Codice == intervento.Chiamata.Codice));
            }

            var CodSedePerMatrix = sintesi.CodSOCompetente.Split('.')[0];
            await _notificationHubContext.Clients.Group("RM.1000").SendAsync("NotifyDoppioneChiamataInCorso", $"Il CodSede è {CodSedePerMatrix}");

            var GetRoomId = _callMatrix.GetChatRoomID(CodSedePerMatrix).Result;
            if (GetRoomId.Error == null)
            {
                await _notificationHubContext.Clients.Group("RM.1000").SendAsync("NotifyDoppioneChiamataInCorso", $"ChatRoomId {GetRoomId.room_id}");

                var GenerateBOT = _callMatrix.PostBotInChatRoom(GetRoomId.room_id).Result;
                await _notificationHubContext.Clients.Group("RM.1000").SendAsync("NotifyDoppioneChiamataInCorso", $"BOTCHIAMATO con esito {GenerateBOT}");

                var call = _callMatrix.PutMessage(GetRoomId.room_id, $"E' stato richiesto un intervento in via {sintesi.Localita.Indirizzo}. Codice Intervento: {sintesi.Codice}").Result;
                if (call.Equals("Invio effettuato con successo"))
                    await _notificationHubContext.Clients.Group("RM.1000").SendAsync("NotifyDoppioneChiamataInCorso", $"Messaggio inviato");
                else
                    await _notificationHubContext.Clients.Group("RM.1000").SendAsync("NotifyDoppioneChiamataInCorso", call);
            }
            else
                await _notificationHubContext.Clients.Group("RM.1000").SendAsync("NotifyDoppioneChiamataInCorso", $"Errore: {GetRoomId.Error}");
        }
    }
}
