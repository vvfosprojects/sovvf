using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SO115App.Persistance.Oracle.Core.Interfacce.GestioneSquadre;

namespace SO115App.API.Oracle.Core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SquadreController : ControllerBase
    {

        private readonly ILogger<ChiamateController> _logger;
        private readonly IGetSquadre _getSquadre;

        public SquadreController(ILogger<ChiamateController> logger, IGetSquadre getSquadre)
        {
            _logger = logger;
            _getSquadre = getSquadre;
        }

        [HttpGet("GetListaGesPreaccoppiati")]
        public IActionResult GetListaGesPreaccoppiati(string codSede)
        {
            try 
            {
                return Ok(_getSquadre.GetListaGesPreaccoppiati(codSede));
            }
            catch 
            {
                return BadRequest();
            }
        }

        [HttpGet("GetSquadraByCodSquadra")]
        public IActionResult GetSquadraByCodSquadra(string codSede,decimal codSquadra)
        {
            try
            {
                return Ok(_getSquadre.GetSquadraByCodSquadra(codSede, codSquadra));
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("GetListaSquadre")]
        public IActionResult GetListaSquadre(string codSede)
        {
            try
            {
                return Ok(_getSquadre.GetListaSquadre(codSede));
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("GetSQPersonaleSquadreByCodSquadra")]
        public IActionResult GetSQPersonaleSquadreByCodSquadra(string codSede, decimal codsquadra)
        {
            try
            {
                return Ok(_getSquadre.GetSQPersonaleSquadreByCodSquadra(codSede,codsquadra));
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("GetListaSQPersonaleSquadre")]
        public IActionResult GetListaSQPersonaleSquadre(string codSede)
        {
            try
            {
                return Ok(_getSquadre.GetListaSQPersonaleSquadre(codSede));
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("GetPersonaleSquadraByCodSquadra")]
        public IActionResult GetPersonaleSquadraByCodSquadra(string codSede, decimal codSquadra)
        {
            try
            {
                return Ok(_getSquadre.GetPersonaleSquadraByCodSquadra(codSede, codSquadra));
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("GetListaPersonaleSquadre")]
        public IActionResult GetListaPersonaleSquadre(string codSede)
        {
            try
            {
                return Ok(_getSquadre.GetListaPersonaleSquadre(codSede));
            }
            catch
            {
                return BadRequest();
            }
        }

    }
}
