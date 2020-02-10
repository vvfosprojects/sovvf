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
    public class TipologieController : ApiController
    {
        
        [HttpGet]    
        public List<ORAGruppo_Tipologie> GetListaGruppoTipologie(string CodSede)
        {
            GetTipologie tipologie = new GetTipologie();
            return tipologie.GetListaGruppoTipologie(CodSede);
        }
               
        [HttpGet]
        public List<ORATipologie> GetListaTipologie(string CodSede)
        {
            GetTipologie tipologie = new GetTipologie();
            return tipologie.GetListaTipologie(CodSede);
        }

        //// GET: api/Squadre/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // POST: api/Squadre
        public void Post([FromBody]string value)
        {
        }
    }
}
