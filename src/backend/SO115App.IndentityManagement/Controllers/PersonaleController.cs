using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using SO115App.ApiIndentityManagement.Servizi;

namespace SO115App.ApiIndentityManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonaleController : ControllerBase
    {
        [HttpGet]
        public ActionResult<List<Componente>> Get([FromQuery(Name = "codiciFiscali")]string[] codiciFiscali)
        {
            List<Componente> ListaComponenti = new List<Componente>();
            try
            {
                ListaComponenti = ComponentiSquadreService.GetListaComponentiSquadra(codiciFiscali);
                return ListaComponenti;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
