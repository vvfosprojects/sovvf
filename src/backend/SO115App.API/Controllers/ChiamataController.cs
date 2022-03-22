//-----------------------------------------------------------------------
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
using CQRS.Commands;
using DomainModel.CQRS.Commands.AddIntervento;
using DomainModel.CQRS.Commands.AddInterventoFromSurvey123;
using DomainModel.CQRS.Commands.UpDateIntervento;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Utility;
using System;
using System.Diagnostics;
using System.Threading.Tasks;

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

        private readonly ICommandHandler<AddInterventoFromSurvey123Command> _addFromSurvey123Handler;
        private readonly ICommandHandler<UpDateInterventoCommand> _Updatehandler;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiRichiestaByCodice;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public ChiamataController(
            ICommandHandler<AddInterventoCommand> Addhandler,
            ICommandHandler<AddInterventoFromSurvey123Command> AddFromSurvey123handler,
            ICommandHandler<UpDateInterventoCommand> Updatehandler,
            IGetSintesiRichiestaAssistenzaByCodice getSintesiRichiestaByCodice)
        {
            _Addhandler = Addhandler;
            _addFromSurvey123Handler = AddFromSurvey123handler;
            _Updatehandler = Updatehandler;
            _getSintesiRichiestaByCodice = getSintesiRichiestaByCodice;
        }

        /// <summary>
        ///   Aggiunta intervento
        /// </summary>
        [ProducesResponseType(typeof(SintesiRichiesta), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [HttpPost("Add")]
        public async Task<IActionResult> Add([FromBody] Intervento chiamata)
        {
            string istanteRichiesta = DateTime.Now.ToString("yyyyMMddHHmmssffff");

            Stopwatch stopWatch = new Stopwatch();

            Log.Information($"--------------------------- INIZIO SCRITTURA INTERVENTO {istanteRichiesta} --------------------------- {DateTime.Now}");
            stopWatch.Start();
            var codiceSede = Request.Headers["codicesede"];
            var idUtente = Request.Headers["IdUtente"];

            var command = new AddInterventoCommand()
            {
                CodCompetenze = chiamata.CodCompetenze,
                Chiamata = chiamata,
                CodiceSede = codiceSede.ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)[0],
                CodUtente = idUtente
            };

            try
            {
                _Addhandler.Handle(command);

                stopWatch.Stop();
                Log.Information($"--------------------------- FINE SCRITTURA INTERVENTO {istanteRichiesta} --------------------------- Elapsed Time {stopWatch.ElapsedMilliseconds}");
                return Ok(_getSintesiRichiestaByCodice.GetSintesi(command.Chiamata.Codice));
            }
            catch (Exception ex)
            {
                ex = ex.GetBaseException();

                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });

                Log.Error($"--------------------------- ERRORE SCRITTURA INTERVENTO --------------------------- {DateTime.Now}");
                Log.Error($"{ex.Message}");
                return BadRequest(new { message = ex.Message, stacktrace = ex.StackTrace });
            }
        }

        /// <summary>
        ///   Aggiunta interventi direttamente da Survey123
        /// </summary>
        [ProducesResponseType(typeof(string), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [HttpPost("AddFromSurvey123")]
        public async Task<IActionResult> AddFromSurvey123([FromBody] ChiamataFromSurvey123 chiamata)
        {
            var codiceSede = chiamata.Localita.Provincia + ".1000";
            var idUtente = Request.Headers["IdUtente"];

            var command = new AddInterventoFromSurvey123Command()
            {
                Chiamata = chiamata,
                CodiceSede = codiceSede.ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)[0],
                CodUtente = idUtente
            };

            try
            {
                _addFromSurvey123Handler.Handle(command);
                return Ok(command.Chiamata.CodiceRichiesta);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Modifica Intervento
        /// </summary>
        //
        [ProducesResponseType(typeof(string), 400)]
        [HttpPost("UpdateIntervento")]
        public async Task<IActionResult> UpdateIntervento([FromBody] Intervento chiamata)
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
