//-----------------------------------------------------------------------
// <copyright file="ComposizioneSquadreController.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.Utility;
using System;
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
    public class ComposizioneSquadreController : ControllerBase
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IQueryHandler<ComposizioneSquadreQuery, ComposizioneSquadreResult> handler;

        private readonly IPrincipal _currentUser;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public ComposizioneSquadreController(IPrincipal currentUser,
            IQueryHandler<ComposizioneSquadreQuery, ComposizioneSquadreResult> handler)
        {
            this.handler = handler;
            _currentUser = currentUser;
        }

        /// <summary>
        ///   Restituisce la lista delle squadre utilizzabili in un determinato comando
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Post(FiltriComposizioneSquadra filtri)
        {
            var query = new ComposizioneSquadreQuery()
            {
                Filtro = filtri,
                CodiciSede = Request.Headers["CodiceSede"][0].Split(',', StringSplitOptions.RemoveEmptyEntries)
            };

            if (ModelState.IsValid)
            {
                try
                {
                    var result = handler.Handle(query);

                    return Ok(result);
                }
                catch (Exception ex)
                {
                    if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                        return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                    else if (ex.Message.Contains("404"))
                        return StatusCode(404, new { message = "Servizio non raggiungibile. Riprovare più tardi" });
                    else
                        return BadRequest(new { message = ex.Message, stacktrace = ex.StackTrace });
                }
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet("{filtro}")]
        public ComposizioneSquadreResult GetMarkerFromId(FiltriComposizioneSquadra filtri)
        {
            var query = new ComposizioneSquadreQuery()
            {
                Filtro = filtri
            };

            return handler.Handle(query);
        }
    }
}
