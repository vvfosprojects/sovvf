//-----------------------------------------------------------------------
// <copyright file="NavbarController.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.NavBar;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Navbar;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class NavbarController : ControllerBase
    {
        private readonly IQueryHandler<NavbarQuery, NavbarResult> handler;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public NavbarController(IQueryHandler<NavbarQuery, NavbarResult> handler)
        {
            this.handler = handler;
        }
    
    
        /// <summary>
        ///   Metodo che restituisce i dati relativi alla Navbar
        /// </summary>
        [HttpGet("")]
        [ProducesResponseType(typeof(Navbar), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> Get()
        {
            var query = new NavbarQuery()
            {
                FiltroBox = "",
                CodSedi = Request.Headers["codiceSede"].ToString().Split(','),
                IdUtente = Request.Headers["idUtente"]
            };

            try
            {
                var result = handler.Handle(query);

                return Ok(result.Navbar);
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message);

                return BadRequest(new
                {
                    ex.Message
                });
            }
        }
    }
}
