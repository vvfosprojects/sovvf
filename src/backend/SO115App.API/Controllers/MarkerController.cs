//-----------------------------------------------------------------------
// <copyright file="MarkerController.cs" company="CNVVF">
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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Classi.Geo;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.MezziMarker;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SediMarker;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MarkerController : ControllerBase
    {
        private readonly IQueryHandler<MezziMarkerQuery, MezziMarkerResult> _mezziMarkerHandler;
        private readonly IQueryHandler<SediMarkerQuery, SediMarkerResult> _sediMarkerHandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _sintesiRichiesteAssistenzaMarkerHandler;

        public MarkerController(IQueryHandler<MezziMarkerQuery, MezziMarkerResult> MezziMarkerHandler,
                                IQueryHandler<SediMarkerQuery, SediMarkerResult> SediMarkerHandler,
                                IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> SintesiRichiesteAssistenzaMarkerHandler)
        {
            _mezziMarkerHandler = MezziMarkerHandler;
            _sediMarkerHandler = SediMarkerHandler;
            _sintesiRichiesteAssistenzaMarkerHandler = SintesiRichiesteAssistenzaMarkerHandler;
        }

        /// <summary>
        ///   Metodo che restituisce i marker di tutte le sedi in un quadrante
        /// </summary>
        [HttpPost("GetSedi")]
        public async Task<IActionResult> GetSedi([FromBody]AreaMappa filtoCentroMappa)
        {
            try
            {
                var query = new SediMarkerQuery()
                {
                    Filtro = filtoCentroMappa
                };

                return Ok(this._sediMarkerHandler.Handle(query).ListaSediMarker);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        ///   Metodo che restituisce i marker di tutte le richieste in un quadrante
        /// </summary>
        [HttpPost("GetRichieste")]
        public async Task<IActionResult> GetRichieste([FromBody]AreaMappa filtoCentroMappa)
        {
            try
            {
                var query = new SintesiRichiesteAssistenzaMarkerQuery()
                {
                    FiltroCentroMappa = filtoCentroMappa
                };

                return Ok(this._sintesiRichiesteAssistenzaMarkerHandler.Handle(query).SintesiRichiestaMarker);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        ///   Metodo che restituisce i marker di tutti i mezzi in un quadrante
        /// </summary>
        [HttpPost("GetMezzi")]
        public async Task<IActionResult> GetMezzi([FromBody]AreaMappa filtoCentroMappa)
        {
            try
            {
                var query = new MezziMarkerQuery()
                {
                    Filtro = filtoCentroMappa
                };

                return Ok(this._mezziMarkerHandler.Handle(query).ListaMezziMarker);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
