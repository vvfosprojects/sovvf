using SO115App.Persistence.Oracle;
using SO115App.Persistence.Oracle.Classi;
using SO115App.Persistence.Oracle.Servizi.SchedeContatto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SO115App.API.Oracle.Controllers
{
    public class SchedeContattoController : ApiController
    {
        [HttpGet]
        public List<ORASchedaContatto> GetSchedeContatto(string codSede)
        {
            GetSchedeContatto schedeContatto = new GetSchedeContatto();
            return schedeContatto.GetListaSchedeContatto(codSede);
        }

        public void Post([FromBody]string value)
        {
        }
    }
}
