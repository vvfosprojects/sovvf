using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;

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
            return _dbContext.SchedeContattoCollection.Find(s => s.CodiceScheda.Equals(Codice)).FirstOrDefault();
        }
    }
}
