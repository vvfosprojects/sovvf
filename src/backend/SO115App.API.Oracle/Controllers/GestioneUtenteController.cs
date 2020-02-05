using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SO115App.API.Oracle.Controllers
{
    public class GestioneUtenteController : ApiController
    {
        // GET: api/GestioneUtente
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/GestioneUtente/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/GestioneUtente
        public void Post([FromBody]string value)
        {
        }
    }
}
