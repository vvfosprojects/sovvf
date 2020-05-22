using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SO115App.Persistance.Oracle.Core.Interfacce.GestioneMezzi;

namespace SO115App.API.Oracle.Core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MezziController : ControllerBase
    {

        private readonly ILogger<ChiamateController> _logger;
        private readonly IGetMezziUtilizzabili _getMezzi;

        public MezziController(ILogger<ChiamateController> logger, IGetMezziUtilizzabili getMezzi)
        {
            _logger = logger;
            _getMezzi = getMezzi;
        }

        [HttpGet("GetMezzoUtilizzabileByCodMezzo")]
        public IActionResult GetMezzoUtilizzabileByCodMezzo([FromBody]decimal codMezzo,string codSede)
        {
            try 
            {
                return Ok(_getMezzi.GetMezzoUtilizzabileByCodMezzo(codSede,codMezzo));
            }
            catch 
            {
                return BadRequest();
            }
        }
        [HttpGet("GetListaAutomezziUtilizzabili")]
        public IActionResult GetListaAutomezziUtilizzabili([FromBody]string codSede)
        {
            try
            {
                return Ok(_getMezzi.GetListaAutomezziUtilizzabili(codSede));
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
