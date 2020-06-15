//-----------------------------------------------------------------------
// <copyright file="ConfermaPartenzeController.cs" company="CNVVF">
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
using DomainModel.CQRS.Commands.ConfermaPartenze;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Classi.Composizione;
using SO115App.Models.Classi.Utility;
using System;
using System.Security.Principal;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    /// <summary>
    ///   Controller per l'accesso alla sintesi sulle richieste di assistenza
    /// </summary>

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ConfermaPartenzeController : ControllerBase
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>

        private readonly ICommandHandler<ConfermaPartenzeCommand> handler;

        private readonly IPrincipal _currentUser;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public ConfermaPartenzeController(IPrincipal currentUser,
            ICommandHandler<ConfermaPartenzeCommand> handler)
        {
            this.handler = handler;
            _currentUser = currentUser;
        }

        /// <summary>
        ///   Metodo di accesso alle richieste di assistenza
        /// </summary>
        /// <returns>il modello del mezzo prenotato</returns>
        [HttpPost]
        public async Task<IActionResult> Post(ConfermaPartenze conferma)
        {
            conferma.CodiceSede = Request.Headers["codicesede"];
            conferma.IdOperatore = Request.Headers["IdUtente"];

            var command = new ConfermaPartenzeCommand()
            {
                ConfermaPartenze = conferma
            };

            try
            {
                handler.Handle(command);

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
