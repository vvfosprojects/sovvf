using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.DataFake.Services;
using SO115App.Models.Classi.Utility;

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
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }
    }
}