using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SO115App.Persistance.Oracle.Core.Interfacce.GestioneSchedeContatto;

namespace SO115App.API.Oracle.Core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SchedeContattoController : ControllerBase
    {

        private readonly ILogger<ChiamateController> _logger;
        private readonly IGetSchedeContatto _getSchedeContatto;

        public SchedeContattoController(ILogger<ChiamateController> logger, IGetSchedeContatto getSchedeContatto)
        {
            _logger = logger;
            _getSchedeContatto = getSchedeContatto;
        }

        [HttpGet("GetMezzoUtilizzabileByCodMezzo")]
        public IActionResult GetSchedeContatto([FromBody]string codSede)
        {
            try 
            {
                return Ok(_getSchedeContatto.GetListaSchedeContatto(codSede));
            }
            catch 
            {
                return BadRequest();
            }
        }
    }
}
