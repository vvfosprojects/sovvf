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
        [HttpGet("{codiceSede}/{codiceSquadra}/{orarioInizio}")]
        public ActionResult<List<Componente>> Get(string codiceSede, string codiceSquadra, string OrarioInizio)
        {
            List<Componente> ListaComponenti = new List<Componente>();
            try
            {
                ListaComponenti = ComponentiSquadreService.GetListaComponentiSquadra(codiceSede, codiceSquadra, OrarioInizio);
                return ListaComponenti;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [HttpGet("{codiceSede}/{codiceSquadra}")]
        public ActionResult<List<Componente>> Get(string codiceSede, string codiceSquadra)
        {
            List<Componente> ListaComponenti = new List<Componente>();
            try
            {
                ListaComponenti = ComponentiSquadreService.GetListaComponentiSquadra(codiceSede, codiceSquadra, "");
                return ListaComponenti;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
