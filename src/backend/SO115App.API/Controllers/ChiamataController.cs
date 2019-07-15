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
using System;
using System.Threading.Tasks;
using CQRS.Commands;
using DomainModel.CQRS.Commands.AddIntervento;
using DomainModel.CQRS.Commands.UpDateIntervento;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;

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

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public ChiamataController(
            ICommandHandler<AddInterventoCommand> Addhandler,
            ICommandHandler<UpDateInterventoCommand> Updatehandler)
        {
            _Addhandler = Addhandler;
            _Updatehandler = Updatehandler;
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add([FromBody]Intervento chiamata)
        {
            var command = new AddInterventoCommand()
            {
                Chiamata = chiamata
            };

            try
            {
                this._Addhandler.Handle(command);
                return Ok(command.Chiamata);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost("UpdateIntervento")]
        public async Task<IActionResult> UpdateIntervento([FromBody]SintesiRichiesta chiamata)
        {
            var command = new UpDateInterventoCommand()
            {
                Chiamata = chiamata
            };

            try
            {
                this._Updatehandler.Handle(command);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
