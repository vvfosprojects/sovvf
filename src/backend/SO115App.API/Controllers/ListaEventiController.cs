//-----------------------------------------------------------------------
// <copyright file="ListaEventiController.cs" company="CNVVF">
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
using System.Threading.Tasks;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGeneration.Contracts.Messaging;
using SO115App.API.Models.Servizi.CQRS.Queries.ListaEventi;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.Utility;

namespace SO115App.API.Controllers
{
    /// <summary>
    ///   Controller per l'accesso alla sintesi sulle richieste di assistenza
    /// </summary>

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ListaEventiController : ControllerBase
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IQueryHandler<ListaEventiQuery, ListaEventiResult> handler;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public ListaEventiController(IQueryHandler<ListaEventiQuery, ListaEventiResult> handler)
        {
            this.handler = handler;
        }

        /// <summary>
        ///   Metodo di accesso alle richieste di assistenza
        /// </summary>
        /// <param name="filtro">Il filtro per le richieste</param>
        /// <returns>Le sintesi delle richieste di assistenza</returns>
        [HttpGet]
        public async Task<IActionResult> Get(string Id)
        {
            FiltroRicercaRichiesteAssistenza filtro = new FiltroRicercaRichiesteAssistenza
            {
                SearchKey = "0"
            };

            var query = new ListaEventiQuery()
            {
                IdRichiesta = Id
            };

            try
            {
                return Ok(this.handler.Handle(query).Eventi);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{filtro}")]
        public ListaEventiResult GetMarkerFromId(FiltroRicercaRichiesteAssistenza filtro)
        {
            var query = new ListaEventiQuery()
            {
                Filtro = filtro
            };

            return this.handler.Handle(query);
        }
    }
}
