using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.AnnullaEmergenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.InsertEmergenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.UpdateEmergenza;
using SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetEmergenzaById;
using SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetListaEmergenzeByCodComando;
using SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetModuliByCodComando;
using SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetTipologieEmergenza;
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
        public async Task<IActionResult> GetListaModuliByCodSede(GetModuliByCodComandoQuery query)
        {
            try
            {
                query.IdSede = Request.Headers["codicesede"].ToString().Split(',')[0];

                return Ok(_getColonneMobiliHandler.Handle(query));
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
