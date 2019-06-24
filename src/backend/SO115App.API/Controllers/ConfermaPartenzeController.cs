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
using CQRS.Queries;
using DomainModel.CQRS.Commands.ConfermaPartenze;
using DomainModel.CQRS.Commands.MezzoPrenotato;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.Composizione;
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
        /// <param name="mezzoPrenotato">il modello del mezzoPrenotato</param>
        /// <returns>il modello del mezzo prenotato</returns>
        [HttpPost]
        public async Task<IActionResult> Post(ConfermaPartenze conferma)
        {
            var codiceSede = Request.Headers["codicesede"];


            var command = new ConfermaPartenzeCommand()
            {
                ConfermaPartenze = conferma,
                codiceSede = codiceSede
            };

            try
            {

                handler.Handle(command);

                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}

