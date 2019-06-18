//-----------------------------------------------------------------------
// <copyright file="WelcomeController.cs" company="CNVVF">
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
using System.Threading.Tasks;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Welcome;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class WelcomeController : ControllerBase
    {
        private readonly IQueryHandler<WelcomeQuery, WelcomeResult> _handler;

        public WelcomeController(IQueryHandler<WelcomeQuery, WelcomeResult> handler)
        {
            _handler = handler;
        }

        /// <summary>
        ///   Metodo di accesso a tutte le informazioni riguardanti il primo caricamento della Home Page
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            FiltroRicercaRichiesteAssistenza filtro = new FiltroRicercaRichiesteAssistenza
            {
                SearchKey = "0"
            };

            try
            {
                var query = new WelcomeQuery()
                {
                    FiltroBox = filtro.SearchKey
                };

                return Ok(this._handler.Handle(query).WelcomeRes);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
