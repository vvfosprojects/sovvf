using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SO115App.Persistance.Oracle.Core.Interfacce.GestioneServizi;

namespace SO115App.API.Oracle.Core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ServiziController : ControllerBase
    {

        private readonly ILogger<ChiamateController> _logger;
        private readonly IGetServizi _getServizi;

        public ServiziController(ILogger<ChiamateController> logger, IGetServizi getServizi)
        {
            _logger = logger;
            _getServizi = getServizi;
        }

        [HttpGet("GetServizi")]
        public IActionResult GetServizi(string codSede)
        {
            try 
            {
                return Ok(_getServizi.GetListaServizi(codSede));
            }
            catch 
            {
                return BadRequest();
            }
        }
    }
}
