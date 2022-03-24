using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneTipologieController : ControllerBase
    {
        private readonly IGetTipologieByCodice _tipologieQueryHandler;

        public GestioneTipologieController(IGetTipologieByCodice tipologieQueryHandler)
        {
            _tipologieQueryHandler = tipologieQueryHandler;
        }
    
        /// <summary>
        ///   Metodo che restituisce la lista delle Tipologie
        /// </summary>
        [HttpGet("")]
        [ProducesResponseType(typeof(List<Tipologia>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> Get()
        {
            try
            {
                return Ok(_tipologieQueryHandler.Get());
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }
    }
}
