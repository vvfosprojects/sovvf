//-----------------------------------------------------------------------
// <copyright file="AuthController.cs" company="CNVVF">
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
using CQRS.Queries;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneUtente.CasLogin;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneUtente.LogIn;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Classi.Utility;

namespace SO115App.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IQueryHandler<LogInQuery, LogInResult> _handler;
        private readonly IQueryHandler<CasLoginQuery, CasLoginResult> _cashandler;
        private readonly IConfiguration _config;

        public AuthController(IQueryHandler<LogInQuery, LogInResult> handler,
                              IQueryHandler<CasLoginQuery, CasLoginResult> Cashandler,
                              IConfiguration config)
        {
            _handler = handler;
            _cashandler = Cashandler;
            _config = config;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] AuthLogIn credenziali)
        {
            var query = new LogInQuery()
            {
                Username = credenziali.username,
                Password = credenziali.password
            };

            try
            {
                var CasAbilitato = _config.GetSection("CasTest").Value;

                if (CasAbilitato.Equals("true"))
                {
                    var utente = (Utente)this._handler.Handle(query).User;

                    if (utente == null)
                    {
                        return StatusCode(403, Costanti.UtenteNonAutorizzato);
                    }

                    return Ok(utente);
                }
                else
                {
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                }
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("no element"))
                    return StatusCode(404, "Credenziali errate");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("TicketLogin")]
        public async Task<IActionResult> TicketLogin([FromBody] CasLogin credenziali)
        {
            var query = new CasLoginQuery()
            {
                Ticket = credenziali.Ticket,
                Service = credenziali.Service
            };

            try
            {
                var utente = (Utente)this._cashandler.Handle(query).User;

                if (utente == null)
                {
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                }

                return Ok(utente);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("no element"))
                    return StatusCode(404, "Credenziali errate");
                return BadRequest(ex.Message);
            }
        }
    }
}
