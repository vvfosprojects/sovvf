//-----------------------------------------------------------------------
// <copyright file="ComposizioneMezziController.cs" company="CNVVF">
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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Hubs;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.Composizione;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Principal;
using System.Threading.Tasks;

/* using SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste; */

namespace SO115App.API.Controllers
{
    /// <summary>
    ///   Controller per l'accesso alla sintesi sulle richieste di assistenza
    /// </summary>

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ComposizionePartenzaAvanzataController : ControllerBase
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IQueryHandler<ComposizioneMezziQuery, ComposizioneMezziResult> _mezziHandler;
        private readonly IQueryHandler<ComposizioneSquadreQuery, ComposizioneSquadreResult> _squadreHandler;

        private readonly IHubContext<NotificationHub> _NotificationHub;
        private readonly IPrincipal _currentUser;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public ComposizionePartenzaAvanzataController(IHubContext<NotificationHub> NotificationHubContext, IPrincipal currentUser,
            IQueryHandler<ComposizioneMezziQuery, ComposizioneMezziResult> mezziHandler, IQueryHandler<ComposizioneSquadreQuery, ComposizioneSquadreResult> squadreHandler)
        {
            this._mezziHandler = mezziHandler;
            this._squadreHandler = squadreHandler;
            _NotificationHub = NotificationHubContext;
            _currentUser = currentUser;
        }

        /// <summary>
        ///   Metodo di accesso alle richieste di assistenza
        /// </summary>
        /// <param name="filtro">Il filtro per le richieste</param>
        /// <returns>Le sintesi delle richieste di assistenza</returns>
        [HttpPost]
        public async Task<IActionResult> Post(FiltriComposizionePartenza filtri)
        {

            var headerValues = Request.Headers["HubConnectionId"];
            string ConId = headerValues.FirstOrDefault();

            var mezziQuery = new ComposizioneMezziQuery()
            {
                Filtro = filtri
            };

            var squadreQuery = new ComposizioneSquadreQuery()
            {
                Filtro = filtri
            };

            if (ModelState.IsValid)
            {
                try
                {
                    List<ComposizioneMezzi> composizioneMezzi = new List<ComposizioneMezzi>();
                    composizioneMezzi = _mezziHandler.Handle(mezziQuery).ComposizioneMezzi;
                    await _NotificationHub.Clients.Client(ConId).SendAsync("NotifyGetComposizioneMezzi", composizioneMezzi);

                    List<ComposizioneSquadre> composizioneSquadre = new List<ComposizioneSquadre>();
                    composizioneSquadre = _squadreHandler.Handle(squadreQuery).ComposizioneSquadre;
                    await _NotificationHub.Clients.Client(ConId).SendAsync("NotifyGetComposizioneSquadre", composizioneSquadre);


                    return Ok();
                }
                catch
                {
                    return BadRequest();
                }
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet("{filtro}")]
        public ComposizioneMezziResult GetMarkerMezziFromId(FiltriComposizionePartenza filtro)
        {
            var mezziQuery = new ComposizioneMezziQuery()
            {
                Filtro = filtro
            };


            return _mezziHandler.Handle(mezziQuery);
        }


        [HttpGet("{filtro}")]
        public ComposizioneSquadreResult GetMarkerSquadreFromId(FiltriComposizionePartenza filtro)
        {
            var squadreQuery = new ComposizioneSquadreQuery()
            {
                Filtro = filtro
            };


            return _squadreHandler.Handle(squadreQuery);
        }
    }
}
