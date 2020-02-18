using SO115App.Persistence.Oracle.Classi;
using SO115App.Persistence.Oracle.Servizi.Distaccamenti;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SO115App.API.Oracle.Controllers
{
    public class DistaccamentiController : ApiController
    {
        [HttpGet]
        public List<ORADistaccamenti> GetDistaccamentoByCodiceSede(string CodSede)
        {
            GetDistaccamentiByCodSede Distaccamenti = new GetDistaccamentiByCodSede();

            return Distaccamenti.GetDistaccamentiBySede(CodSede);
        }
    }
}
