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
        public ActionResult<List<SquadreNelTurno>> GetSquadreNelTurno(string codiceSede, string codiceTurno)
        {
            List<SquadreNelTurno> ListaSquadre = new List<SquadreNelTurno>();
            try
            {
                ListaSquadre = SquadreNelTurnoService.GetListaSquadreNelTurno(codiceSede, codiceTurno);
                return ListaSquadre;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [HttpGet("{codiceSede}")]
        public ActionResult<List<SquadreNelTurno>> GetSquadreBySede(string codiceSede)
        {
            List<SquadreNelTurno> ListaSquadre = new List<SquadreNelTurno>();
            try
            {
                ListaSquadre = SquadreNelTurnoService.GetListaSquadreNelTurno(codiceSede, "");
                return ListaSquadre;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
