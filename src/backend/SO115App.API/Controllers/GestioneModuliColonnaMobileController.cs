using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetModuliByCodComando;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneModuliColonnaMobileController : ControllerBase
    {
        private readonly IQueryHandler<GetModuliByCodComandoQuery, GetModuliByCodComandoResult> _getColonneMobiliHandler;

        public GestioneModuliColonnaMobileController(IQueryHandler<GetModuliByCodComandoQuery, GetModuliByCodComandoResult> getColonneMobiliHandler)
        {
            _getColonneMobiliHandler = getColonneMobiliHandler;
        }

        /// <summary>
        ///   Restituisce la lista dei moduli di colonna mobile di una specifica sede
        /// </summary>
        [HttpPost("GetListaModuliByCodSede")]
        [ProducesResponseType(typeof(GetModuliByCodComandoResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetListaModuliByCodSede(GetModuliByCodComandoQuery query)
        {
            try
            {
                query.IdSede = Request.Headers["codicesede"].ToString().Split(',')[0];

                return Ok(_getColonneMobiliHandler.Handle(query));
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
