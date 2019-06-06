//-----------------------------------------------------------------------
// <copyright file="NavbarController.cs" company="CNVVF">
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
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Hubs;
using SO115App.API.Models.Classi.Navbar;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Navbar;
using System.Linq;
using System.Net;
using System.Security.Principal;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class NavbarController : ControllerBase
    {
        private readonly IQueryHandler<NavbarQuery, NavbarResult> handler;
        private readonly IHubContext<NotificationHub> _NotificationHub;
        private readonly IPrincipal _currentUser;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public NavbarController(IPrincipal currentUser, IHubContext<NotificationHub> NotificationHubContext,
            IQueryHandler<NavbarQuery, NavbarResult> handler)
        {
            this.handler = handler;
            _NotificationHub = NotificationHubContext;
            _currentUser = currentUser;
        }

        /// <summary>
        ///   Metodo di accesso alle richieste di assistenza
        /// </summary>
        /// <param name="filtro">Il filtro per le richieste</param>
        /// <returns>Le sintesi delle richieste di assistenza</returns>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var headerValues = Request.Headers["HubConnectionId"];
            string ConId = headerValues.FirstOrDefault();

            var query = new NavbarQuery()
            {
                FiltroBox = ""
            };

            try
            {
                Navbar navbar = new Navbar();
                navbar = handler.Handle(query).Navbar;

                await _NotificationHub.Clients.Client(ConId).SendAsync("NotifyGetNavbar", navbar);

                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
