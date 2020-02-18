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
    public class InterventiController : ApiController
    {
        // GET: api/Interventi/GetListaInterventi
        [HttpGet]
        public List<ORAInterventi> GetListaInterventi(string CodSede)
        {
            GetInterventi interventi = new GetInterventi();
            return interventi.GetListaInterventi(CodSede);
        }

        // GET: api/Interventi/GetListaInterventiChiusi
        [HttpGet]
        public List<ORAInterventiChiusi> GetListaInterventiChiusi(string CodSede)
        {
            GetInterventi interventi = new GetInterventi();
            return interventi.GetListaInterventiChiusi(CodSede);
        }

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
