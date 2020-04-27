using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.DataFake.Services;

namespace SO115App.API.DataFake.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SquadraController : ControllerBase
    {
        [HttpGet("GetListaSquadreByCodComando")]
        public async Task<IActionResult> GetListaSquadreByCodComando(string CodComando)
        {
            try
            {
                GetSquadre getSquadre = new GetSquadre();
                return Ok(getSquadre.Get(CodComando));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
