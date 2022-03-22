//-----------------------------------------------------------------------
// <copyright file="GestioneRuoloController.cs" company="CNVVF">
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
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddRuoliUtente;
using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.DeleteRuoliUtente;

namespace SO115App.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneRuoloController : ControllerBase
    {
        private readonly ICommandHandler<AddRuoliUtenteCommand> _addRuoliCommand;
        private readonly ICommandHandler<DeleteRuoliUtenteCommand> _deleteRuoliCommand;

        public GestioneRuoloController(
            ICommandHandler<AddRuoliUtenteCommand> addRuoliCommand,
            ICommandHandler<DeleteRuoliUtenteCommand> deleteRuoliCommand)
        {
            _addRuoliCommand = addRuoliCommand;
            _deleteRuoliCommand = deleteRuoliCommand;
        }
    
        /// <summary>
        ///   Metodo che permette di aggiungere un ruolo ad un Utente
        /// </summary>
        [HttpPost("AddRuolo")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult AddRuolo(AddRuoliUtenteCommand command)
        {
            command.CodiceSede = Request.Headers["codiceSede"];
            try
            {
                _addRuoliCommand.Handle(command);
                return Ok();
            }
            catch (System.Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });

                if (ex.Message.Contains(Costanti.RuoloUtentePresente))
                    return StatusCode(403, new { message = Costanti.RuoloUtentePresente });

                return BadRequest(new { message = ex.Message });
            }
        }
    
        /// <summary>
        ///   Metodo che permette di rimuovere un ruolo ad un Utente
        /// </summary>
        [HttpPost("DeleteRuolo")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult DeleteRuolo(DeleteRuoliUtenteCommand command)
        {
            command.CodiceSede = Request.Headers["codiceSede"];
            try
            {
                _deleteRuoliCommand.Handle(command);
                return Ok();
            }
            catch (System.Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
