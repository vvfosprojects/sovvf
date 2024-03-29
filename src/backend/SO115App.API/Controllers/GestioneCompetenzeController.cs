﻿using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCompetenze;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneCompetenzeController : ControllerBase
    {
        private readonly IQueryHandler<GetCompetenzeQuery, GetCompetenzeResult> _getCompetenze;

        public GestioneCompetenzeController(IQueryHandler<GetCompetenzeQuery, GetCompetenzeResult> getCompetenze)
        {
            _getCompetenze = getCompetenze;
        }

        /// <summary>
        ///   Restituisce le competenze di una richiesta, in base alle coordinate di un indirizzo
        /// </summary>
        [HttpPost("GetCompetenze")]
        [ProducesResponseType(typeof(GetCompetenzeResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetCompetenze([FromBody] Coordinate coordinate)
        {
            try
            {
                var query = new GetCompetenzeQuery()
                {
                    CodiciSede = Request.Headers["codicesede"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries),
                    IdOperatore = Request.Headers["IdUtente"],

                    Coordinate = coordinate
                };

                return Ok(_getCompetenze.Handle(query));
            }
            catch (Exception ex)
            {
                ex = ex.GetBaseException();

                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }
    }
}
