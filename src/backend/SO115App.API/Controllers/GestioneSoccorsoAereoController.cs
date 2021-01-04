using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneSoccorsoAereoController : ControllerBase
    {
        [HttpGet("GetCategorieSoccorso")]
        public async Task<IActionResult> GetCategorieSoccorso()
        {
            try
            {
                var idUtente = Request.Headers["IdUtente"];
                var codiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries);

                //return null;
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
        }

        [HttpGet("GetTipologieSoccorso")]
        public async Task<IActionResult> GetTipologieSoccorso()
        {
            try
            {
                var idUtente = Request.Headers["IdUtente"];
                var codiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries);

                return null;
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
        }

        [HttpGet("GetInfoRichiestaSoccorso")]
        public async Task<IActionResult> GetInfoRichiestaSoccorso(string requestKey)
        {
            try
            {
                var idUtente = Request.Headers["IdUtente"];
                var codiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries);

                return null;
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
        }

        [HttpGet("GetStoricoRichiestaSoccorso")]
        public async Task<IActionResult> GetStoricoRichiestaSoccorso(string requestKey)
        {
            try
            {
                var idUtente = Request.Headers["IdUtente"];
                var codiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries);

                return null;
            }
            catch (Exception e)
            {
                throw e.GetBaseException();
            }
        }
    }
}
