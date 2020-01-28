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
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.MergeSchedeNue;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.SetSchedaGestita;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.SetSchedaLetta;
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
        private readonly ICommandHandler<SetSchedaLettaCommand> _setLetta;
        private readonly ICommandHandler<MergeSchedeNueCommand> _setMerge;

        public GestioneSchedeContattoController(
            IQueryHandler<GetSchedeFiltrateQuery, GetSchedeFiltrateResult> queryHandler,
            ICommandHandler<SetSchedaGestitaCommand> setGestita,
            ICommandHandler<SetSchedaLettaCommand> setLetta,
            ICommandHandler<MergeSchedeNueCommand> setMerge
            )
        {
            _queryHandler = queryHandler ?? throw new ArgumentNullException(nameof(_queryHandler));
            _setGestita = setGestita ?? throw new ArgumentNullException(nameof(_setGestita));
            _setLetta = setLetta ?? throw new ArgumentNullException(nameof(_setLetta));
            _setMerge = setMerge;
        }

        [HttpPost("GetSchede")]
        public async Task<IActionResult> Get([FromBody]FiltriSchede filtri)
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
            catch (Exception)
            {
                return BadRequest();
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
                return BadRequest();
            }
        }

        [HttpPost("MergeSchede")]
        public async Task<IActionResult> MergeSchede([FromBody]SchedaContatto scheda)
        {
            string IdUtente = Request.Headers["IdUtente"];
            string codiceSede = Request.Headers["codiceSede"];

            var command = new MergeSchedeNueCommand()
            {
                CodiceSede = Request.Headers["codiceSede"],
                IdUtente = IdUtente,
                SchedaNue = scheda
            };

            try
            {
                _setMerge.Handle(command);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}
