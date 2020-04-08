using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SO115App.Persistence.Oracle.Servizi.Richieste;
using SO115App.Persistence.Oracle.Classi;

namespace SO115App.API.Oracle.Controllers
{
    public class RichiesteController : ApiController
    {
        // GET: api/Richieste/GetListaChiamate
        [HttpGet]
        public List<ORAChiamate> GetListaChiamate(string CodSede)
        {
            GetChiamate chiamate = new GetChiamate();
            return chiamate.GetListaChiamate(CodSede);
        }

        // GET: api/Richieste
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Richieste/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Richieste
        public void Post([FromBody]string value)
        {
        }
    }
}
