using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SO115App.ApiIndentityManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonaleController : ControllerBase
    {
        [HttpGet("{codiciFiscali}")]
        public ActionResult<List<Componente>> Get(string codiceSede, string[] ListaCodiciFiscali)
        {
            List<Componente> ListaComponenti = new List<Componente>();
            try
            {
                ListaComponenti = ComponentiSquadreService.GetListaComponentiSquadra(codiceSede, ListaCodiciFiscali);
                return ListaComponenti;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
