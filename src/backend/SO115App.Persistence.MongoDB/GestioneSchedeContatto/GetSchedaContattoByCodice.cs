using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.GestioneSchedeContatto
{
    public class GetSchedaContattoByCodice : IGetSchedaContattoByCodice
    {
        private readonly DbContext _dbContext;

        public GetSchedaContattoByCodice(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public SchedaContatto Get(string Codice)
        {
            List<SchedaContatto> listaSchedeContatto = new List<SchedaContatto>();
            var indexWildcardTextSearch = new CreateIndexModel<SchedaContatto>(Builders<SchedaContatto>.IndexKeys.Text("$**"));
            List<CreateIndexModel<SchedaContatto>> indexes = new List<CreateIndexModel<SchedaContatto>>();
            indexes.Add(indexWildcardTextSearch);
            _dbContext.SchedeContattoCollection.Indexes.CreateMany(indexes);

            return _dbContext.SchedeContattoCollection.Find(s => s.CodiceScheda.Equals(Codice)).FirstOrDefault();
        }
    }
}
