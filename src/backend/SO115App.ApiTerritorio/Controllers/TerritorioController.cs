using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SO115App.ApiTerritorio.Classi;
using SO115App.ApiTerritorio.Servizi;

namespace SO115App.ApiTerritorio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TerritorioController : ControllerBase
    {
        [HttpGet]
        public ActionResult<List<AnagraficaIstat>> GetAlberaturaIstat()
        {
            AnagraficaService anagrafica = new AnagraficaService();
            var CalService = anagrafica.ListaAlberaturaRegioni();

            return null;
        }
    }
}
