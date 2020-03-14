using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.DataFake.Services;
using SO115App.Models.Classi.Utility;

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
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }
    }
}