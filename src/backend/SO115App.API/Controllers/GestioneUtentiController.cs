//-----------------------------------------------------------------------
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
using CQRS.Queries;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddUtente;
using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.CancellazioneUtente;
using SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.DettaglioUtente;
using SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.ListaOperatori;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneUtentiController : ControllerBase
    {
        private readonly ICommandHandler<AddUtenteCommand> _addUtenteCommand;
        private readonly ICommandHandler<DeleteUtenteCommand> _deleteUtenteCommand;
        private readonly IQueryHandler<ListaOperatoriQuery, ListaOperatoriResult> _listaOperatoriQueryHandler;
        private readonly IQueryHandler<DettaglioUtenteQuery, DettaglioUtenteResult> _dettaglioUtente;

        public GestioneUtentiController(
            ICommandHandler<AddUtenteCommand> addUtenteCommand,
            ICommandHandler<DeleteUtenteCommand> deleteUtenteCommand,
            IQueryHandler<ListaOperatoriQuery, ListaOperatoriResult> listaOperatoriQueryHandler,
            IQueryHandler<DettaglioUtenteQuery, DettaglioUtenteResult> dettaglioUtente)
        {
            _addUtenteCommand = addUtenteCommand;
            _deleteUtenteCommand = deleteUtenteCommand;
            _listaOperatoriQueryHandler = listaOperatoriQueryHandler;
            _dettaglioUtente = dettaglioUtente;
        }

        [HttpPost("AddUtente")]
        public IActionResult AddUtente([FromBody] AddUtenteCommand command)
        {
            command.CodiceSede = Request.Headers["codiceSede"];
            try
            {
                _addUtenteCommand.Handle(command);
                return Ok();
            }
            catch (System.Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                if (ex.Message.Contains(Costanti.RuoloUtentePresente))
                    return StatusCode(403, Costanti.RuoloUtentePresente);

                return BadRequest();
            }
        }

        [HttpPost("DeleteUtente")]
        public IActionResult DeleteUtente([FromBody] DeleteUtenteCommand command)
        {
            command.CodiceSede = Request.Headers["codiceSede"];
            try
            {
                _deleteUtenteCommand.Handle(command);
                return Ok();
            }
            catch (System.Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }

        [HttpGet("GetUtente")]
        public IActionResult GetUtente(string id)
        {
            var query = new DettaglioUtenteQuery();

            query.IdUtente = id;

            try
            {
                return Ok(_dettaglioUtente.Handle(query));
            }
            catch (System.Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                else if (ex.Message.Contains("404"))
                    return StatusCode(404, "Servizio non raggiungibile. Riprovare più tardi");
                else
                    return BadRequest();
            }
        }

        [HttpPost("GetUtenti")]
        public IActionResult GetUtenti([FromBody] ListaOperatoriQuery query)
        {
            query.IdUtente = Request.Headers["IdUtente"];

            try
            {
                return Ok(_listaOperatoriQueryHandler.Handle(query));
            }
            catch (System.Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                else if (ex.Message.Contains("404"))
                    return StatusCode(404, "Servizio non raggiungibile. Riprovare più tardi");
                else
                    return BadRequest();
            }
        }
    }
}
