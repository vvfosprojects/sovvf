//-----------------------------------------------------------------------
// <copyright file="GestioneRichiestaController.cs" company="CNVVF">
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
using CQRS.Commands;
using CQRS.Queries;
using DomainModel.CQRS.Commands.UpDateStatoRichiesta;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.Models.Classi.Utility;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneRichiestaController : ControllerBase
    {
        private readonly ICommandHandler<UpDateStatoRichiestaCommand> _addhandler;

        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult>
            _sintesiRichiesteQuery;

        public GestioneRichiestaController(
            ICommandHandler<UpDateStatoRichiestaCommand> addhandler, IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteQuery)
        {
            _addhandler = addhandler;
            _sintesiRichiesteQuery = sintesiRichiesteQuery;
        }

        [HttpPost("AggiornaStato")]
        public async Task<IActionResult> AggiornaStato([FromBody]UpDateStatoRichiestaCommand richiesta)
        {
            var codiceSede = Request.Headers["codicesede"];
            var headerValues = Request.Headers["IdUtente"];
            var idOperatore = headerValues.FirstOrDefault();

            var command = new UpDateStatoRichiestaCommand()
            {
                IdOperatore = idOperatore,
                IdRichiesta = richiesta.IdRichiesta,
                Note = richiesta.Note ?? "",
                Stato = richiesta.Stato,
                CodiceSede = codiceSede
            };

            try
            {
                this._addhandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }

        [HttpGet("GetRichiesta")]
        public async Task<IActionResult> GetRichiesta(string idRichiesta)
        {
            var sintesiQuery = new SintesiRichiesteAssistenzaQuery();
            try
            {
                var listaSintesi = _sintesiRichiesteQuery.Handle(sintesiQuery).SintesiRichiesta;
                return Ok(listaSintesi.LastOrDefault(x => x.Codice == idRichiesta));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }
    }
}
