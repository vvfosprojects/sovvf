﻿//-----------------------------------------------------------------------
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
using Serilog;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.Models.Classi.Utility;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ComposizioneMezziController : ControllerBase
    {
        private readonly IQueryHandler<ComposizioneMezziQuery, ComposizioneMezziResult> _handler;

        public ComposizioneMezziController(IQueryHandler<ComposizioneMezziQuery, ComposizioneMezziResult> handler)
        {
            _handler = handler;
        }

        /// <summary>
        ///   Restituisce la lista dei mezzi utilizzabili in un determinato comando
        /// </summary>
        [ProducesResponseType(typeof(ComposizioneMezziResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [HttpPost("")]
        public async Task<IActionResult> Post(ComposizioneMezziQuery query)
        {
            query.CodiciSedi = Request.Headers["CodiceSede"][0].Split(',', StringSplitOptions.RemoveEmptyEntries);
            query.IdOperatore = Request.Headers["idUtente"].ToString();

            try
            {
                var result = _handler.Handle(query);

                return Ok(result);
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else if (ex.Message.Contains("404"))
                    return StatusCode(404, new { message = "Servizio non raggiungibile. Riprovare più tardi" });
                else
                    return BadRequest(new { message = ex.Message, stacktrace = ex.StackTrace });
            }
        }
    }
}
