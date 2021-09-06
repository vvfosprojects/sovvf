using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Classi.ServiziEsterni.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;

namespace SO115App.Persistence.MongoDB.GestioneSchedeContatto
{
    public class GetSchedeContatto : IGetSchedeContatto_WSNUE
    {
        private readonly DbContext _dbContext;

        public GetSchedeContatto(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<SchedaContatto> GetAllSchedeContatto(string CodiceSede)
        {
            List<SchedaContatto> listaSchedeContatto = new List<SchedaContatto>();

            if (CodiceSede.Length > 0)
            {
                var lll = _dbContext.SchedeContattoCollection.Find(s => s.CodiceSede != "").ToList();
                listaSchedeContatto = _dbContext.SchedeContattoCollection.Find(s => s.CodiceSede.Equals(CodiceSede)).ToList();
            }
            else
                listaSchedeContatto = _dbContext.SchedeContattoCollection.Find(Builders<SchedaContatto>.Filter.Empty).ToList();

            return listaSchedeContatto;
        }
    }
}
