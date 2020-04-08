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
    public class SquadreController : ControllerBase
    {
        [HttpGet("{codiceSede}/{codiceTurno}")]
        public ActionResult<List<SquadreNelTurno>> GetSquadreNelTurno([FromQuery]string codiceSede, string codiceTurno)
        {
            try
            {
                return SquadreNelTurnoService.GetListaSquadreNelTurno(codiceSede, codiceTurno);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [HttpGet("{codiceSede}")]
        public ActionResult<List<SquadreNelTurno>> GetSquadreBySede([FromQuery]string codiceSede)
        {
            try
            {
                return SquadreNelTurnoService.GetListaSquadreNelTurno(codiceSede, "");
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
