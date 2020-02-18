using SO115App.Persistence.Oracle.Classi;
using SO115App.Persistence.Oracle.Servizi.Competenze;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SO115App.API.Oracle.Controllers
{
    public class CompetenzeController : ApiController
    {
        [HttpGet]
        public List<ORACompetenzeElenco> GetListaCompetenzeElenco(string CodSede)
        {
            GetCompetenze competenze = new GetCompetenze();
            return competenze.GetListaCompetenzeElenco(CodSede);
        }

        [HttpGet]
        public List<ORACompetenzeZone> GetListaCompetenzeZone(string CodSede)
        {
            GetCompetenze competenze = new GetCompetenze();
            return competenze.GetListaCompetenzeZone(CodSede);
        }

        [HttpGet]
        public List<ORACompetenzeByNomeVia> GetCompetenzeByNomeVia(string CodSede, string NomeVia, string Civico)
        {
            GetCompetenzeByNomeVia competenze = new GetCompetenzeByNomeVia();
            return competenze.GetCompetenzeByNomeStrada(CodSede, NomeVia, Civico);
        }

        // POST: api/Squadre
        public void Post([FromBody]string value)
        {
        }
    }
}
