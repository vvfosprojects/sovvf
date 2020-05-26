
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SO115App.Persistance.Oracle.Core.Interfacce.GestioneChiamate;

namespace SO115App.API.Oracle.Core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChiamateController : ControllerBase
    {

        private readonly ILogger<ChiamateController> _logger;
        private readonly IGetChiamate _getChiamate;

        public ChiamateController(ILogger<ChiamateController> logger, IGetChiamate getChiamate)
        {
            _logger = logger;
            _getChiamate = getChiamate;
        }

        [HttpGet]
        public IActionResult Get(string codSede)
        {
            try 
            {
                return Ok(_getChiamate.GetListaChiamate(codSede));
            }
            catch 
            {
                return BadRequest();
            }
        }
    }
}
