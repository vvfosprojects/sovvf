using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.DataFake.Services;

namespace SO115App.API.DataFake.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreaccoppiatiController : ControllerBase
    {
        [HttpGet("GetListaPreaccoppiatiByCodComando")]
        public async Task<IActionResult> GetListaPreaccoppiatiByCodComando(string CodComando)
        {
            try
            {
                GetPreaccoppiati getPreaccoppiati = new GetPreaccoppiati();
                return Ok(getPreaccoppiati.Get(CodComando));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
