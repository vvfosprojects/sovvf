//-----------------------------------------------------------------------
// <copyright file="PersonaleVVFController.cs" company="CNVVF">
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
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.ListaPersonaleVVF;
using System.Collections.Generic;

namespace SO115App.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonaleVVFController : ControllerBase
    {
        public readonly IQueryHandler<PersonaleVVFQuery, PersonaleVVFResult> _queryHandlerPersonale;

        public PersonaleVVFController(IQueryHandler<PersonaleVVFQuery, PersonaleVVFResult> queryHandlerPersonale)
        {
            _queryHandlerPersonale = queryHandlerPersonale;
        }

        /// <summary>
        ///   Metodo che restituisce la lista del personale VVF
        /// </summary>
        [HttpPost()]
        [ProducesResponseType(typeof(List<PersonaleVVF>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult Get([FromBody] PersonaleVVFQuery query)
        {
            query.CodiceSede = Request.Headers["codiceSede"];

            try
            {
                return Ok(_queryHandlerPersonale.Handle(query).ListaPersonale);
            }
            catch (System.Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else if (ex.Message.Contains("404"))
                    return StatusCode(404, new { message = "Servizio non raggiungibile. Riprovare più tardi" });
                else
                    return BadRequest(new { ex.Message });
            }
        }
    }
}
