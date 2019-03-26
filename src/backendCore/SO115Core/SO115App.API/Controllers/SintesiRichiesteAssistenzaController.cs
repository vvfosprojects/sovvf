//-----------------------------------------------------------------------
// <copyright file="SintesiRichiesteAssistenzaController.cs" company="CNVVF">
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
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using SimpleInjector;
using SO115App.API.Hubs;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Servizi.CQRS.Queries;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza.QueryDTO;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza.ResultDTO;
using SO115App.API.Models.Servizi.Infrastruttura;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste;

namespace SO115App.API.Controllers
{
    /// <summary>
    ///   Controller per l'accesso alla sintesi sulle richieste di assistenza
    /// </summary>

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SintesiRichiesteAssistenzaController : ControllerBase
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> handler;
        private readonly ILogger _logger;
        private readonly IHubContext<NotificationHub> _NotificationHub;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public SintesiRichiesteAssistenzaController(ILogger logger,IHubContext<NotificationHub> NotificationHubContext,
            IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> handler)
        {            
            this.handler = handler;
            _NotificationHub = NotificationHubContext;
            _logger = logger;
        }

        /// <summary>
        ///   Metodo di accesso alle richieste di assistenza
        /// </summary>
        /// <param name="filtro">Il filtro per le richieste</param>
        /// <returns>Le sintesi delle richieste di assistenza</returns>    
        public async Task<IActionResult> Get()
        {

            this._logger.Log(this.GetType().Name + " - L'utente ha richiesto la lista Sintesi");

            //VIENE UTILIZZATO SOLO PER TEST E FAKE
            FiltroRicercaRichiesteAssistenza filtro = new FiltroRicercaRichiesteAssistenza();
            filtro.SearchKey = "0";

            var query = new SintesiRichiesteAssistenzaQuery()
            {
                Filtro = filtro
            };

            this._logger.Log(this.GetType().Name + " - Richiamo l'Handler per la ricerca della Sintesi");

            return Ok(this.handler.Handle(query));
        }


        [HttpGet("{searchkey}")]
        public async Task<IActionResult> Get(string searchkey)
        {

            this._logger.Log(this.GetType().Name + " - L'utente ha richiesto la Sintesi con id " + searchkey);

            FiltroRicercaRichiesteAssistenza filtro = new FiltroRicercaRichiesteAssistenza();
            filtro.SearchKey = searchkey;

            var query = new SintesiRichiesteAssistenzaQuery()
            {
                Filtro = filtro
            };

            this._logger.Log(this.GetType().Name + " - Richiamo l'Handler per la ricerca della Sintesi");

            return Ok(this.handler.Handle(query));
        }


        [HttpPost]
        public SintesiRichiesteAssistenzaResult Post(FiltroRicercaRichiesteAssistenza filtro)
        {
            
            var query = new SintesiRichiesteAssistenzaQuery()
            {
                Filtro = filtro
            };

            return this.handler.Handle(query);
        }

    }
}
