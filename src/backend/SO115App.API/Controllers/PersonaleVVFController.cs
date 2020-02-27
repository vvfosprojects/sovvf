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
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.ListaPersonaleVVF;

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

        [HttpGet()]
        public IActionResult Get(string text)
        {
            var codiceSede = Request.Headers["codiceSede"];
            var personaleQuery = new PersonaleVVFQuery
            {
                Text = text,
                CodiceSede = codiceSede
            };

            try
            {
                return Ok(_queryHandlerPersonale.Handle(personaleQuery).ListaPersonale);
            }
            catch (System.Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }
    }
}
