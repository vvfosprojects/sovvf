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
using System.Collections.Generic;
using System.Threading.Tasks;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Classi.Geo;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.MezziMarker;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SediMarker;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.Marker.SchedeNueMarker;

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
        private readonly IQueryHandler<SchedeNueMarkerQuery, SchedeNueMarkerResult> _schedeNueMarkerHandler;

        public MarkerController(IQueryHandler<MezziMarkerQuery, MezziMarkerResult> mezziMarkerHandler,
                                IQueryHandler<SediMarkerQuery, SediMarkerResult> sediMarkerHandler,
                                IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> sintesiRichiesteAssistenzaMarkerHandler,
                                IQueryHandler<SchedeNueMarkerQuery, SchedeNueMarkerResult> schedeNueMarkerHandler)
        {
            _mezziMarkerHandler = mezziMarkerHandler;
            _sediMarkerHandler = sediMarkerHandler;
            _sintesiRichiesteAssistenzaMarkerHandler = sintesiRichiesteAssistenzaMarkerHandler;
            _schedeNueMarkerHandler = schedeNueMarkerHandler;
        }

        /// <summary>
        ///   Metodo che restituisce i marker di tutte le sedi in un quadrante
        /// </summary>
        [HttpPost("GetSedi")]
        public async Task<IActionResult> GetSedi([FromBody]AreaMappa filtroCentroMappa)
        {
            try
            {
                var query = new SediMarkerQuery()
                {
                    Filtro = filtroCentroMappa
                };

                return Ok(this._sediMarkerHandler.Handle(query).ListaSediMarker);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }

        /// <summary>
        ///   Metodo che restituisce i marker di tutte le richieste in un quadrante
        /// </summary>
        [HttpPost("GetRichieste")]
        public async Task<IActionResult> GetRichieste([FromBody]AreaMappa filtroCentroMappa)
        {

            var codiciSedi = Request.Headers["codiceSede"].ToString().Split(',');

            try
            {
                var query = new SintesiRichiesteAssistenzaMarkerQuery()
                {
                    FiltroCentroMappa = filtroCentroMappa,
                    CodiciSedi = codiciSedi
                };

                return Ok(this._sintesiRichiesteAssistenzaMarkerHandler.Handle(query).SintesiRichiestaMarker);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }

        /// <summary>
        ///   Metodo che restituisce i marker di tutti i mezzi in un quadrante
        /// </summary>
        [HttpPost("GetMezzi")]
        public async Task<IActionResult> GetMezzi(AreaMappa filtroCentroMappa)
        {
            filtroCentroMappa.CodiceSede = new List<string>
            {
                Request.Headers["codiceSede"].ToString()
            };
            try
            {
                var query = new MezziMarkerQuery()
                {
                    Filtro = filtroCentroMappa
                };

                return Ok(this._mezziMarkerHandler.Handle(query).ListaMezziMarker);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }

        /// <summary>
        ///   Metodo che restituisce i marker di tutti i mezzi in un quadrante
        /// </summary>
        [HttpPost("GetSchedeContatto")]
        public async Task<IActionResult> GetSchedeContatto(AreaMappa filtroCentroMappa)
        {
            filtroCentroMappa.CodiceSede = new List<string>
            {
                Request.Headers["codiceSede"].ToString()
            };
            try
            {
                var query = new SchedeNueMarkerQuery()
                {
                    Filtro = filtroCentroMappa
                };

                return Ok(this._schedeNueMarkerHandler.Handle(query));
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
