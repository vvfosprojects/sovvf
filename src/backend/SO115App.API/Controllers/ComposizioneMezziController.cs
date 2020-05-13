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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.Utility;

namespace SO115App.API.Controllers
{
    /// <summary>
    ///   Controller per l'accesso alla sintesi sulle richieste di assistenza
    /// </summary>

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ComposizioneMezziController : ControllerBase
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IQueryHandler<ComposizioneMezziQuery, ComposizioneMezziResult> handler;

        private readonly IPrincipal _currentUser;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public ComposizioneMezziController(IPrincipal currentUser,
            IQueryHandler<ComposizioneMezziQuery, ComposizioneMezziResult> handler)
        {
            this.handler = handler;
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
            var codiceSede = Request.Headers["codicesede"];
            var headerValues = Request.Headers["HubConnectionId"];
            string ConId = headerValues.FirstOrDefault();

            var query = new ComposizioneMezziQuery()
            {
                Filtro = filtri,
                CodiceSede = codiceSede
            };

            if (ModelState.IsValid)
            {
                try
                {
                    List<ComposizioneMezzi> composizioneMezzi = handler.Handle(query).ComposizioneMezzi;
                    return Ok();
                }
                catch (Exception ex)
                {
                    if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                        return StatusCode(403, Costanti.UtenteNonAutorizzato);
                    else if (ex.Message.Contains("404"))
                        return StatusCode(404, "Servizio non raggiungibile. Riprovare più tardi");
                    else
                        return BadRequest();
                }
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet("{filtro}")]
        public ComposizioneMezziResult GetMarkerFromId(FiltriComposizionePartenza filtro)
        {
            var query = new ComposizioneMezziQuery()
            {
                Filtro = filtro
            };

            return handler.Handle(query);
        }
    }
}
