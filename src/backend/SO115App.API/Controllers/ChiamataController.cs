﻿//-----------------------------------------------------------------------
// <copyright file="InserimentoInterventoController.cs" company="CNVVF">
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
using CQRS.Commands;
using DomainModel.CQRS.Commands.AddIntervento;
using DomainModel.CQRS.Commands.UpDateIntervento;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Utility;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChiamataController : ControllerBase
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly ICommandHandler<AddInterventoCommand> _Addhandler;

        private readonly ICommandHandler<UpDateInterventoCommand> _Updatehandler;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiRichiestaByCodice;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public ChiamataController(
            ICommandHandler<AddInterventoCommand> Addhandler,
            ICommandHandler<UpDateInterventoCommand> Updatehandler,
            IGetSintesiRichiestaAssistenzaByCodice getSintesiRichiestaByCodice)
        {
            _Addhandler = Addhandler;
            _Updatehandler = Updatehandler;
            _getSintesiRichiestaByCodice = getSintesiRichiestaByCodice;
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add([FromBody] Intervento chiamata)
        {
            var codiceSede = Request.Headers["codicesede"];
            var idUtente = Request.Headers["IdUtente"];

            var command = new AddInterventoCommand()
            {
                Chiamata = chiamata,
                CodiceSede = codiceSede.ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)[0],
                CodUtente = idUtente
            };

            try
            {
                _Addhandler.Handle(command);
                return Ok(_getSintesiRichiestaByCodice.GetSintesi(command.Chiamata.Codice));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("UpdateIntervento")]
        public async Task<IActionResult> UpdateIntervento([FromBody] SintesiRichiesta chiamata)
        {
            var codiceSede = Request.Headers["codicesede"];
            var idUtente = Request.Headers["IdUtente"];

            var command = new UpDateInterventoCommand()
            {
                Chiamata = chiamata,
                CodiceSede = codiceSede,
                CodUtente = idUtente
            };

            try
            {
                this._Updatehandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
