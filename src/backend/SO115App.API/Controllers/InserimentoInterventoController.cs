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
using System.Threading.Tasks;
using CQRS.Commands;
using DomainModel.CQRS.Commands.AddIntervento;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class InserimentoInterventoController : ControllerBase
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly ICommandHandler<AddInterventoCommand> _handler;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public InserimentoInterventoController(
            ICommandHandler<AddInterventoCommand> handler)
        {
            _handler = handler;
        }

        [HttpPost]
        public async Task<IActionResult> InserimentoIntervento([FromBody]Intervento chiamata)
        {
            var command = new AddInterventoCommand()
            {
                Chiamata = chiamata
            };

            try
            {
                this._handler.Handle(command);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
