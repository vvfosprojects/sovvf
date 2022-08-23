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
using DomainModel.CQRS.Commands.PresaInCarico;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneIntervento;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneIntervento
{
    public class NotificationPresaInCarico : INotifyPresaInCaricoRichiesta
    {
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> _sintesiRichiesteAssistenzaHandler;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IConfiguration _config;
        private readonly GetSediPartenze _getSediPartenze;

        public NotificationPresaInCarico(IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteAssistenzaHandler,
                                          GetGerarchiaToSend getGerarchiaToSend, IConfiguration config, GetSediPartenze getSediPartenze)

        {
            _sintesiRichiesteAssistenzaHandler = sintesiRichiesteAssistenzaHandler;
            _getGerarchiaToSend = getGerarchiaToSend;
            _config = config;
            _getSediPartenze = getSediPartenze;
        }

        public async Task SendNotification(PresaInCaricoCommand intervento)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            var SediDaNotificare = new List<string>();
            if (intervento.Chiamata.CodSOAllertate != null)
                SediDaNotificare = _getGerarchiaToSend.Get(intervento.Chiamata.CodSOCompetente, intervento.Chiamata.CodSOAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(intervento.Chiamata.CodSOCompetente);

            var listaSediPartenze = _getSediPartenze.GetFromSintesi(intervento.Chiamata);

            if (listaSediPartenze != null)
                SediDaNotificare.AddRange(listaSediPartenze);

            var infoDaNotificare = new List<InfoDaNotificarePresaInCarico>();

            Parallel.ForEach(SediDaNotificare, sede =>
            {
                var info = new InfoDaNotificarePresaInCarico();
                var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery
                {
                    Filtro = new FiltroRicercaRichiesteAssistenza
                    {
                        idOperatore = intervento.IdUtente
                    },
                    CodiciSede = new string[] { sede }
                };
                var listaSintesi = (List<SintesiRichiesta>)this._sintesiRichiesteAssistenzaHandler.Handle(sintesiRichiesteAssistenzaQuery).SintesiRichiesta;

                intervento.Chiamata = listaSintesi.LastOrDefault(richiesta => richiesta.Id == intervento.Chiamata.Id);

                info.codiceSede = sede;
                info.internvento = intervento;

                infoDaNotificare.Add(info);
            });

            foreach (var info in infoDaNotificare)
            {
                await hubConnection.StartAsync();
                await hubConnection.InvokeAsync("ModifyAndNotifySuccessPresaInCarico", info.internvento, info.codiceSede);
                await hubConnection.StopAsync();
            }
        }
    }

    internal class InfoDaNotificarePresaInCarico
    {
        public string codiceSede { get; set; }
        public PresaInCaricoCommand internvento { get; set; }
    }
}
