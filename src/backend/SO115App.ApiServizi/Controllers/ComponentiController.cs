using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SO115App.ApiServizi.Classi;
using SO115App.ApiServizi.Servizi;

namespace SO115App.ApiServizi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComponentiController : ControllerBase
    {
        [HttpGet]
        public ActionResult<List<Componente>> Get([FromQuery]string codiceSede, string codiceSquadra, string codiceTurno)
        {
            try
            {
                return ComponentiSquadreService.GetListaComponentiSquadra(codiceSede, codiceSquadra, codiceTurno);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
