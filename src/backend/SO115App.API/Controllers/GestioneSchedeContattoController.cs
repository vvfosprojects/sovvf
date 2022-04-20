//-----------------------------------------------------------------------
// <copyright file="GestioneSchedeContattoController.cs" company="CNVVF">
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
using SO115App.Models.Classi.NUE;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.MergeSchedeNue;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.SetSchedaGestita;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.UndoMergeSchedeNue;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetContatoreSchede;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedeContatto;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedeFiltrate;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneSchedeContattoController : ControllerBase
    {
        private readonly IQueryHandler<GetSchedeFiltrateQuery, GetSchedeFiltrateResult> _queryHandler;
        private readonly IQueryHandler<GetSchedeContattoQuery, GetSchedeContattoResult> _queryhandlerSchede;
        private readonly IQueryHandler<GetConteggioSchedeQuery, GetConteggioSchedeResult> _queryhandlerContatoriSchede;
        private readonly ICommandHandler<SetSchedaGestitaCommand> _setGestita;
        private readonly ICommandHandler<MergeSchedeNueCommand> _setMerge;
        private readonly ICommandHandler<UndoMergeSchedeNueCommand> _undoMergeSchede;

        public GestioneSchedeContattoController(
            IQueryHandler<GetSchedeFiltrateQuery, GetSchedeFiltrateResult> queryHandler,
            IQueryHandler<GetSchedeContattoQuery, GetSchedeContattoResult> queryhandlerSchede,
            IQueryHandler<GetConteggioSchedeQuery, GetConteggioSchedeResult> queryhandlerContatoriSchede,
            ICommandHandler<SetSchedaGestitaCommand> setGestita,
            ICommandHandler<MergeSchedeNueCommand> setMerge,
            ICommandHandler<UndoMergeSchedeNueCommand> undoMergeSchede)
        {
            _queryHandler = queryHandler ?? throw new ArgumentNullException(nameof(_queryHandler));
            _setGestita = setGestita ?? throw new ArgumentNullException(nameof(_setGestita));
            _setMerge = setMerge;
            _undoMergeSchede = undoMergeSchede ?? throw new ArgumentNullException(nameof(_undoMergeSchede));
            _queryhandlerSchede = queryhandlerSchede;
            _queryhandlerContatoriSchede = queryhandlerContatoriSchede;
        }
    
        /// <summary>
        ///   Metodo che restituisce le Schede Contatto
        /// </summary>
        [HttpPost("GetSchede")]
        [ProducesResponseType(typeof(GetSchedeFiltrateResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> Get([FromBody] GetSchedeFiltrateQuery query)
        {
            query.IdUtente = Request.Headers["IdUtente"].ToString();
            query.CodiciSede = Request.Headers["codiceSede"].ToArray();

            try
            {
                return Ok(_queryHandler.Handle(query));
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }
    
        /// <summary>
        ///   Metodo che restituisce i contatori relativi alle Schede Contatto
        /// </summary>
        [HttpGet("GetContatoriSchede")]
        [ProducesResponseType(typeof(GetConteggioSchedeResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetContatoriSchede()
        {
            var query = new GetConteggioSchedeQuery()
            {
                CodiciSede = Request.Headers["codiceSede"].ToArray()
            };

            try
            {
                return Ok(_queryhandlerContatoriSchede.Handle(query));
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }
    
        /// <summary>
        ///   Metodo che restituisce una specifica Scheda Contatto
        /// </summary>
        [HttpGet("GetByCodiceScheda")]
        [ProducesResponseType(typeof(SchedaContatto), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> Get(string codice)
        {
            var query = new GetSchedeContattoQuery() { CodiceSede = Request.Headers["codiceSede"].ToArray()[0] };

            try
            {
                return Ok(_queryhandlerSchede.Handle(query).SchedeContatto.FirstOrDefault(s => s.CodiceScheda == codice));
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }
    
        /// <summary>
        ///   Metodo che gestisce una specifica Scheda Contatto
        /// </summary>
        [HttpPut("SetGestita")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> SetGestita([FromBody] SetSchedaGestitaCommand command)
        {
            command.CodiceSede = Request.Headers["codiceSede"];
            command.IdUtente = Request.Headers["IdUtente"];

            try
            {
                _setGestita.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }
    
        /// <summary>
        ///   Metodo che permette di raggruppare una lista di Schede Contatto
        /// </summary>
        [HttpPost("MergeSchede")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> MergeSchede([FromBody] string[] scheda)
        {
            string idUtente = Request.Headers["IdUtente"];

            var command = new MergeSchedeNueCommand()
            {
                CodiceSede = Request.Headers["codiceSede"],
                IdUtente = idUtente,
                schedeSelezionateID = scheda
            };

            try
            {
                _setMerge.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }
    
        /// <summary>
        ///   Metodo che permettere di eliminare le schede raggruppate ad una specifica Scheda Contatto
        /// </summary>
        [HttpPost("UndoMergeSchede")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> UndoMerge([FromBody] SchedaContatto scheda)
        {
            var idUtente = Request.Headers["IdUtente"];
            string codiceSede = Request.Headers["codiceSede"];
            var command = new UndoMergeSchedeNueCommand
            {
                CodiceSede = codiceSede,
                IdUtente = idUtente,
                SchedaNue = scheda
            };

            try
            {
                _undoMergeSchede.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
