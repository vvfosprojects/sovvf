﻿//-----------------------------------------------------------------------
// <copyright file="GestioneUtentiController.cs" company="CNVVF">
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
using DomainModel.CQRS.Commands.GestioneFonogramma;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Fonogramma;
using SO115App.Models.Classi.Utility;

namespace SO115App.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneFonogrammaController : ControllerBase
    {
        private readonly ICommandHandler<FonogrammaCommand> _addFonogramma;

        public GestioneFonogrammaController(ICommandHandler<FonogrammaCommand> addFonogramma)
        {
            _addFonogramma = addFonogramma;
        }

        /// <summary>
        ///   Restituisce le informazioni relative al fonogramma di uno specifico intervento
        /// </summary>
        [HttpPost("InfoFonogramma")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult InfoFonogramma([FromBody] Fonogramma fonogramma)
        {
            try
            {
                fonogramma.IdOperatore = Request.Headers["IdUtente"];

                var command = new FonogrammaCommand()
                {
                    Fonogramma = fonogramma
                };

                _addFonogramma.Handle(command);
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
    }
}
