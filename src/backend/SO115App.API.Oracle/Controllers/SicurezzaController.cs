using SO115App.Persistence.Oracle.Classi;
using SO115App.Persistence.Oracle.Servizi.Sicurezza;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SO115App.API.Oracle.Controllers
{
    public class SicurezzaController : ApiController
    {
        // GET: api/Sicurezza/GetListaOperatori
        [HttpGet]
        public List<ORAOperatori> GetListaOperatori(string CodSede)
        {
            GetOperatori listaOperatori = new GetOperatori();
            return listaOperatori.GetListaOperatori(CodSede);
        }

        // GET: api/Sicurezza/GetListaAccessi
        [HttpGet]
        public List<ORAAccessi> GetListaAccessi(string CodSede)
        {
            GetAccessi listaAccessi = new GetAccessi();
            return listaAccessi.GetListaAccessi(CodSede);
        }

        // GET: api/Sicurezza/GetListaAccessiOperatrori
        [HttpGet]
        public List<ORAAccessiOperatori> GetListaAccessiOperatrori(string CodSede)
        {
            GetAccessi GetAccessi = new GetAccessi();
            return GetAccessi.GetListaAccessiOperatori(CodSede);
        }

        // GET: api/Sicurezza/GetListaMacchine
        [HttpGet]
        public List<ORAListaMachine> GetListaMacchine(string CodSede)
        {
            GetAccessi GetAccessi = new GetAccessi();
            return GetAccessi.GetListaMacchine(CodSede);
        }

        public void Post([FromBody]string value)
        {
        }
    }
}
