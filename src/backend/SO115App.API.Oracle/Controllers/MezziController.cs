using SO115App.Persistence.Oracle.Classi;
using SO115App.Persistence.Oracle.Servizi.Mezzi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SO115App.API.Oracle.Controllers
{
    public class MezziController : ApiController
    {
        [HttpGet]
        public List<ORAAutomezzi> GetListaMezziUtilizzabili(string CodSede)
        {
            GetListaMezziUtilizzabili listamezzi = new GetListaMezziUtilizzabili();
            return listamezzi.GetListaAutomezziUtilizzabili(CodSede);
        }

        [HttpGet]
        public ORAAutomezzi GetMezzoUtilizzabileByCodMezzo(string CodSede, decimal CodMezzo)
        {
            GetListaMezziUtilizzabili listamezzi = new GetListaMezziUtilizzabili();
            return listamezzi.GetMezzoUtilizzabileByCodMezzo(CodSede, CodMezzo);
        }

        // POST: api/Mezzi
        public void Post([FromBody]string value)
        {
        }
    }
}
