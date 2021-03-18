﻿//-----------------------------------------------------------------------
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
using DomainModel.CQRS.Commands.AllertaAltreSedi;
using DomainModel.CQRS.Commands.UpDateStatoRichiesta;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCodiciRichiesteAssistenza;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetSintesiRichiestaAssistenza;
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
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> _sintesiRichiesteQuery;
        private readonly IQueryHandler<GetSintesiRichiestaAssistenzaQuery, GetSintesiRichiestaAssistenzaResult> _getSingolaRichiesta;
        private readonly IQueryHandler<GetCodiciRichiesteAssistenzaQuery, GetCodiciRichiesteAssistenzaResult> _getCodiciRichiesta;
        private readonly ICommandHandler<AllertaAltreSediCommand> _allertaSediHandler;

        public GestioneRichiestaController(
            ICommandHandler<UpDateStatoRichiestaCommand> addhandler,
            IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteQuery,
            IQueryHandler<GetSintesiRichiestaAssistenzaQuery, GetSintesiRichiestaAssistenzaResult> getSingolaRichiesta,
            IQueryHandler<GetCodiciRichiesteAssistenzaQuery, GetCodiciRichiesteAssistenzaResult> getCodiciRichiesta,
            ICommandHandler<AllertaAltreSediCommand> allertaSediHandler
            )
        {
            _addhandler = addhandler;
            _sintesiRichiesteQuery = sintesiRichiesteQuery;
            _getSingolaRichiesta = getSingolaRichiesta;
            _getCodiciRichiesta = getCodiciRichiesta;
            _allertaSediHandler = allertaSediHandler;
        }

        [HttpGet("GetRichiesta")]
        public async Task<IActionResult> GetRichiesta(string idRichiesta)
        {
            var sintesiQuery = new GetSintesiRichiestaAssistenzaQuery
            {
                CodiceRichiesta = idRichiesta,
                CodiceSede = Request.Headers["codiceSede"]
            };
            try
            {
                return Ok(_getSingolaRichiesta.Handle(sintesiQuery).SintesiRichiesta);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("GetRichieste")]
        public async Task<IActionResult> GetRichieste(FiltroRicercaRichiesteAssistenza filtro)
        {
            filtro.idOperatore = Request.Headers["idUtente"];
            var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery
            {
                CodiciSede = Request.Headers["codiceSede"].ToString().Split(','),
                Filtro = filtro
            };

            try
            {
                return Ok(_sintesiRichiesteQuery.Handle(sintesiRichiesteAssistenzaQuery));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetCodiciRichieste")]
        public async Task<IActionResult> GetCodiciRichieste(string idRichiesta)
        {
            var sintesiRichiesteAssistenzaQuery = new GetCodiciRichiesteAssistenzaQuery
            {
                idRichiesta = idRichiesta
            };

            try
            {
                return Ok(_getCodiciRichiesta.Handle(sintesiRichiesteAssistenzaQuery));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("AggiornaStato")]
        public async Task<IActionResult> AggiornaStato([FromBody] UpDateStatoRichiestaCommand richiesta)
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
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("AllertaAltreSedi")]
        public async Task<IActionResult> AllertaSedi([FromBody] AllertaAltreSediCommand parametri)
        {
            var idOperatore = Request.Headers["IdUtente"];
            parametri.CodUtente = idOperatore;

            try
            {
                this._allertaSediHandler.Handle(parametri);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(new { message = ex.Message });
            }
        }
    }
}
