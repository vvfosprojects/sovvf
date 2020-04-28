using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.DataFake.Services;

namespace SO115App.API.DataFake.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MezziController : ControllerBase
    {
        [HttpGet("GetListaMezziByCodComando")]
        public async Task<IActionResult> GetListaMezziByCodComando(string CodComando)
        {
            try
            {
                GetListaMezziUtilizzabili getMezzi = new GetListaMezziUtilizzabili();
                return Ok(getMezzi.Get(CodComando));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
