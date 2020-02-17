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

        [HttpPost("AddRuolo")]
        public IActionResult AddRuolo(AddRuoliUtenteCommand command)
        {
            try
            {
                _addRuoliCommand.Handle(command);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("DeleteRuolo")]
        public IActionResult DeleteRuolo(DeleteRuoliUtenteCommand command)
        {
            try
            {
                _deleteRuoliCommand.Handle(command);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
