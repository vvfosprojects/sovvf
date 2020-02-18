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
        
        [HttpGet]    
        public List<ORAPartenze> GetListaPartenze(string CodSede)
        {
            GetPartenze partenze = new GetPartenze();
            return partenze.GetListaPartenze(CodSede);
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
