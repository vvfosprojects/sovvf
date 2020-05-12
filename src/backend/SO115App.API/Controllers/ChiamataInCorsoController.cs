//-----------------------------------------------------------------------
// <copyright file="ChiamataInCorsoController.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CQRS.Commands;
using CQRS.Queries;
using DomainModel.CQRS.Commands.ChiamataInCorsoMarker;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.ListaChiamateInCorsoMarker;
using SO115App.Models.Classi.Marker;
using SO115App.Models.Classi.Utility;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChiamataInCorsoController : ControllerBase
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly ICommandHandler<ChiamataInCorsoMarkerCommand> _Addhandler;

        private readonly ICommandHandler<CancellazioneChiamataInCorsoMarkerCommand> _Delhandler;
        private readonly ICommandHandler<UpDateChiamataInCorsoMarkerCommand> _upDatehandler;
        private readonly IQueryHandler<ListaChiamateInCorsoMarkerQuery, ListaChiamateInCorsoMarkerResult> _listaChiamateInCorsoMarkerhandler;
        private readonly ICommandHandler<CancellazioneChiamataInCorsoByIdUtenteMarkerCommand> _delhandlerByIdUtente;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public ChiamataInCorsoController(
            ICommandHandler<ChiamataInCorsoMarkerCommand> Addhandler,
            ICommandHandler<CancellazioneChiamataInCorsoMarkerCommand> Delhandler,
            ICommandHandler<UpDateChiamataInCorsoMarkerCommand> UpDatehandler,
            IQueryHandler<ListaChiamateInCorsoMarkerQuery, ListaChiamateInCorsoMarkerResult> ListaChiamateInCorsoMarkerhandler,
            ICommandHandler<CancellazioneChiamataInCorsoByIdUtenteMarkerCommand> DelhandlerByIdUtente
            )
        {
            _Addhandler = Addhandler;
            _Delhandler = Delhandler;
            _upDatehandler = UpDatehandler;
            _listaChiamateInCorsoMarkerhandler = ListaChiamateInCorsoMarkerhandler;
            _delhandlerByIdUtente = DelhandlerByIdUtente;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var Listaquery = new ListaChiamateInCorsoMarkerQuery();
            try
            {
                return Ok((List<ChiamateInCorso>)this._listaChiamateInCorsoMarkerhandler.Handle(Listaquery).ListaChiamateInCorsoMarker);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            };
        }

        [HttpPost("Add")]
        [EnableCors()]
        public async Task<IActionResult> Add([FromBody]ChiamateInCorso chiamata)
        {
            var command = new ChiamataInCorsoMarkerCommand()
            {
                AddChiamataInCorso = chiamata
            };

            try
            {
                this._Addhandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }

        [HttpPost("Delete")]
        public async Task<IActionResult> Delete([FromBody]ChiamateInCorso chiamata)
        {
            var command = new CancellazioneChiamataInCorsoMarkerCommand()
            {
                ChiamataInCorso = chiamata
            };

            try
            {
                this._Delhandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest(); ;
            }
        }

        [HttpGet("DeleteAll")]
        public async Task<IActionResult> DeleteAll()
        {
            var command = new CancellazioneChiamataInCorsoByIdUtenteMarkerCommand()
            {
                IdUtente = Request.Headers["IdUtente"],
                CodiceSede = Request.Headers["codicesede"]
            };

            try
            {
                this._delhandlerByIdUtente.Handle(command);

                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest(); ;
            }
        }

        [HttpPost("UpDate")]
        public async Task<IActionResult> UpDate([FromBody]ChiamateInCorso chiamata)
        {
            var command = new UpDateChiamataInCorsoMarkerCommand()
            {
                ChiamataInCorso = chiamata
            };

            try
            {
                this._upDatehandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }
    }
}
