using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneEntiController : ControllerBase
    {

        public GestioneEntiController()
        {

        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add()
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost("Update")]
        public async Task<IActionResult> Update()
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
