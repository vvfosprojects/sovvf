using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SO115App.Persistance.Oracle.Core.Interfacce.GestioneRichieste;

namespace SO115App.API.Oracle.Core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InterventiController : ControllerBase
    {

        private readonly ILogger<ChiamateController> _logger;
        private readonly IGetRichieste _getRichieste;

        public InterventiController(ILogger<ChiamateController> logger, IGetRichieste getRichieste)
        {
            _logger = logger;
            this._getRichieste = getRichieste;
        }

        [HttpGet("GetInterventiChiusi")]
        public IActionResult GetInterventiChiusi(string codSede)
        {
            try 
            {
                return Ok(_getRichieste.GetListaInterventiChiusi(codSede));
            }
            catch 
            {
                return BadRequest();
            }
        }
        [HttpGet("GetInterventiAperti")]
        public IActionResult GetInterventiAperti(string codSede)
        {
            try
            {
                return Ok(_getRichieste.GetListaInterventi(codSede));
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
