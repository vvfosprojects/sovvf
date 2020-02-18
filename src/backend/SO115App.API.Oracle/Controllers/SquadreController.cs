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
    public class SquadreController : ApiController
    {
        // GET: api/Squadre/GetListaPersonaleSquadre
        [HttpGet]
        public List<ORAPersonaleSquadre> GetListaPersonaleSquadre(string CodSede)
        {
            GetSquadre Squadre = new GetSquadre();
            return Squadre.GetListaPersonaleSquadre(CodSede);
        }

        // GET: api/Squadre/GetPersonaleSquadraByCodSquadra
        [HttpGet]
        public ORAPersonaleSquadre GetPersonaleSquadraByCodSquadra(string CodSede, decimal CodSquadra)
        {
            GetSquadre Squadre = new GetSquadre();
            return Squadre.GetPersonaleSquadraByCodSquadra(CodSede, CodSquadra);
        }

        // GET: api/Squadre/GetListaSQPersonaleSquadre
        [HttpGet]
        public List<ORASQPersonaleSquadre> GetListaSQPersonaleSquadre(string CodSede)
        {
            GetSquadre Squadre = new GetSquadre();
            return Squadre.GetListaSQPersonaleSquadre(CodSede);
        }

        // GET: api/Squadre/GetListaSQPersonaleSquadreByCodSquadra
        [HttpGet]
        public ORASQPersonaleSquadre GetSQPersonaleSquadreByCodSquadra(string CodSede, decimal CodSquadra)
        {
            GetSquadre Squadre = new GetSquadre();
            return Squadre.GetSQPersonaleSquadreByCodSquadra(CodSede, CodSquadra);
        }

        // GET: api/Squadre/GetListaSquadre
        [HttpGet]
        public List<ORASquadre> GetListaSquadre(string CodSede)
        {
            GetSquadre Squadre = new GetSquadre();
            return Squadre.GetListaSquadre(CodSede);
        }

        // GET: api/Squadre/GetSquadraByCodSquadra
        [HttpGet]
        public ORASquadre GetSquadraByCodSquadra(string CodSede, decimal CodSquadra)
        {
            GetSquadre Squadre = new GetSquadre();
            return Squadre.GetSquadraByCodSquadra(CodSede, CodSquadra);
        }

        // GET: api/Squadre/GetListaGesPreaccoppiati
        [HttpGet]
        public List<ORAGesPreaccoppiati> GetListaGesPreaccoppiati(string CodSede)
        {
            GetSquadre Squadre = new GetSquadre();
            return Squadre.GetListaGesPreaccoppiati(CodSede);
        }

        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Squadre
        public void Post([FromBody]string value)
        {
        }
    }
}
