using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
//using SO115App.Persistence.File;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneFileController : ControllerBase
    {
        //TODO: fare query e commands

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string path)
        {
            //var manager = new PDFManager(path);

            //manager.prova();

            //manager.salva(/*"C:\\Users\\francescodangelis\\Desktop\\PDFResults\\"*/);

            return Ok();
        }
    }
}
