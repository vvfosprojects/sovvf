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
using Microsoft.AspNetCore.SignalR.Client;
using Serilog;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.Models.Classi.CodaChiamate;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamata;
using SO115App.SignalR.Utility;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneChiamata
{
    public class NotificationInserimentoChiamata : INotifyInserimentoChiamata
    {
        //private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;

        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _sintesiRichiesteAssistenzaMarkerHandler;

        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationInserimentoChiamata(//IHubContext<NotificationHub> notificationHubContext,
                                               IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
                                               IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> sintesiRichiesteAssistenzaMarkerHandler,
                                               GetGerarchiaToSend getGerarchiaToSend)
        {
            //_notificationHubContext = notificationHubContext;
            _boxRichiesteHandler = boxRichiesteHandler;
            _sintesiRichiesteAssistenzaMarkerHandler = sintesiRichiesteAssistenzaMarkerHandler;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        public async Task SendNotification(AddInterventoCommand command)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl("https://localhost:44381/SubHub")
                        .Build();

            #endregion connessione al WSSignalR

            var sedeComando = "";
            if (command.sintesi.CodSOCompetente.Contains("."))
                sedeComando = command.sintesi.CodSOCompetente.Split('.')[0] + ".1000";
            else
                sedeComando = command.sintesi.CodSOCompetente;

            var SediDaNotificare = _getGerarchiaToSend.Get(sedeComando);

            try
            {
                var listaInfoDaSperide = new List<InfoDaSpedire>();
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
                        codDistaccamento = command.sintesi.Competenze[0].Codice,
                        count = 1
                    };

                    var info = new InfoDaSpedire()
                    {
                        sintesiRichiestaMarker = listaSintesiMarker,
                        boxInterventi = boxInterventi,
                        counterNotifica = counterCodaChiamate,
                        sede = sede
                    };
                    listaInfoDaSperide.Add(info);
                });

                foreach (var info in listaInfoDaSperide)
                {
                    await hubConnection.StartAsync();
                    await hubConnection.InvokeAsync("NotifyGetBoxInterventi", info.boxInterventi, info.sede);
                    await hubConnection.InvokeAsync("SaveAndNotifySuccessChiamata", command.sintesi, info.sede);
                    await hubConnection.InvokeAsync("NotifyGetRichiestaMarker", info.sintesiRichiestaMarker.LastOrDefault(marker => marker.Codice == command.Chiamata.Codice), info.sede);
                    await hubConnection.InvokeAsync("NotifyAddChiamateCodaChiamate", info.counterNotifica, info.sede);
                    await hubConnection.StopAsync();
                };
            }
            catch (Exception ex)
            {
                await hubConnection.StopAsync();
            }
        }
    }

    public class InfoDaSpedire
    {
        public string sede { get; set; }
        public BoxInterventi boxInterventi { get; set; }
        public List<SintesiRichiestaMarker> sintesiRichiestaMarker { get; set; }
        public CounterNotifica counterNotifica { get; set; }
    }
}
