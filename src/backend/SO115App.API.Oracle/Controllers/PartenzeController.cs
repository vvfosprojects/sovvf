using SO115App.Persistence.Oracle.Classi;
using SO115App.Persistence.Oracle.Servizi.Partenze;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SO115App.API.Oracle.Controllers
{
    public class PartenzeController : ApiController
    {
        // GET: api/Partenze/GetListaPartenzeByCodIntervento
        [HttpGet]
        public List<ORAPartenze> GetListaPartenzeByCodIntervento(string CodSede, decimal CodIntervento)
        {
            GetPartenze partenze = new GetPartenze();
            return partenze.GetListaPartenzeByCodIntervento(CodSede, CodIntervento);
        }

        public void Post([FromBody]string value)
        {
        }
    }
}
