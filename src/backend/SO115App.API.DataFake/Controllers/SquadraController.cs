using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.DataFake.Services;
using SO115App.Models.Classi.Utility;

namespace SO115App.API.DataFake.Controllers
{
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
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }
    }
}