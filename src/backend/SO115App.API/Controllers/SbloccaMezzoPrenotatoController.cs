//-----------------------------------------------------------------------
// <copyright file="SbloccaMezzoPrenotatoController.cs" company="CNVVF">
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
using DomainModel.CQRS.Commands.MezzoPrenotato;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Composizione;
using SO115App.SignalR;
using System;
using System.Linq;
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
    public class SbloccaMezzoPrenotatoController : ControllerBase
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>

        private readonly ICommandHandler<SbloccaMezzoPrenotatoCommand> handler;

        private readonly IHubContext<NotificationHub> _NotificationHub;
        private readonly IPrincipal _currentUser;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public SbloccaMezzoPrenotatoController(IHubContext<NotificationHub> NotificationHubContext, IPrincipal currentUser,
            ICommandHandler<SbloccaMezzoPrenotatoCommand> handler)
        {
            this.handler = handler;
            _NotificationHub = NotificationHubContext;
            _currentUser = currentUser;
        }

        /// <summary>
        ///   Metodo di accesso alle richieste di assistenza
        /// </summary>
        /// <param name="mezzoPrenotato">il modello del mezzoPrenotato</param>
        /// <returns>il modello del mezzo prenotato</returns>
        [HttpPost]
        public async Task<IActionResult> Post(MezzoPrenotato mezzoPrenotato)
        {
            var headerValues = Request.Headers["HubConnectionId"];
            var codiceSede = Request.Headers["codicesede"];
            string ConId = headerValues.FirstOrDefault();

            var command = new SbloccaMezzoPrenotatoCommand()
            {
                MezzoPrenotato = mezzoPrenotato
            };

            if (ModelState.IsValid)
            {
                try
                {
                    handler.Handle(command);
                    await _NotificationHub.Clients.Group(codiceSede).SendAsync("NotifySbloccaMezzoPrenotato", command);

                    // await _NotificationHub.Clients.Client(ConId).SendAsync("NotifySbloccaMezzoPrenotato", command);

                    return Ok();
                }
                catch
                {
                    return BadRequest();
                }
            }
            else
            {
                return BadRequest();
            }
        }
    }
}
