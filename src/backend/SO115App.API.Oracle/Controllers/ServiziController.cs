using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SO115App.Persistence.Oracle.Servizi.Squadre;
using SO115App.Persistence.Oracle.Classi;

namespace SO115App.API.Oracle.Controllers
{
    public class ServiziController : ApiController
    {
        // GET: api/Servizi/GetListaServizi
        [HttpGet]
        public List<ORAServizi> GetListaServizi(string CodSede)
        {
            GetServizi Servizi = new GetServizi();
            return Servizi.GetListaServizi(CodSede);
        }

        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        public string Get(int id)
        {
            return "value";
        }

        public void Post([FromBody]string value)
        {
        }
    }
}
