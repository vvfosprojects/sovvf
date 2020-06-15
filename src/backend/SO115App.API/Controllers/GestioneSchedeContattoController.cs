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
using SO115App.Models.Classi.Filtri;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.MergeSchedeNue;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.SetSchedaGestita;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.UndoMergeSchedeNue;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedeFiltrate;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneSchedeContattoController : ControllerBase
    {
        private readonly IQueryHandler<GetSchedeFiltrateQuery, GetSchedeFiltrateResult> _queryHandler;
        private readonly ICommandHandler<SetSchedaGestitaCommand> _setGestita;
        private readonly ICommandHandler<MergeSchedeNueCommand> _setMerge;
        private readonly ICommandHandler<UndoMergeSchedeNueCommand> _undoMergeSchede;

        public GestioneSchedeContattoController(
            IQueryHandler<GetSchedeFiltrateQuery, GetSchedeFiltrateResult> queryHandler,
            ICommandHandler<SetSchedaGestitaCommand> setGestita,
            ICommandHandler<MergeSchedeNueCommand> setMerge,
            ICommandHandler<UndoMergeSchedeNueCommand> undoMergeSchede)
        {
            _queryHandler = queryHandler ?? throw new ArgumentNullException(nameof(_queryHandler));
            _setGestita = setGestita ?? throw new ArgumentNullException(nameof(_setGestita));
            _setMerge = setMerge;
            _undoMergeSchede = undoMergeSchede ?? throw new ArgumentNullException(nameof(_undoMergeSchede));
        }

        [HttpPost("GetSchede")]
        public async Task<IActionResult> Get([FromBody] FiltriSchede filtri)
        {
            filtri.IdUtente = Request.Headers["IdUtente"];

            var query = new GetSchedeFiltrateQuery()
            {
                CodiceSede = Request.Headers["codiceSede"],
                Filtro = filtri
            };

            try
            {
                return Ok(this._queryHandler.Handle(query).SchedeContatto);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("SetGestita")]
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
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("MergeSchede")]
        public async Task<IActionResult> MergeSchede([FromBody] SchedaContatto scheda)
        {
            string idUtente = Request.Headers["IdUtente"];

            var command = new MergeSchedeNueCommand()
            {
                CodiceSede = Request.Headers["codiceSede"],
                IdUtente = idUtente,
                SchedaNue = scheda
            };

            try
            {
                _setMerge.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("UndoMergeSchede")]
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
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
