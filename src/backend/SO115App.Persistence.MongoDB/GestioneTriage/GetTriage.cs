using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Triage;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTriage;
using SO115App.Models.Servizi.Infrastruttura.GestioneTriage;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneTriage
{
    public class GetTriage : IGetTriage
    {
        private readonly DbContext _dbContext;

        public GetTriage(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        Triage IGetTriage.GetTriage(GetTriageQuery getTriageQuery)
        {
            return _dbContext.TriageCollection.Find(c => getTriageQuery.CodiceSede.Contains(c.CodiceSede) && c.CodDettaglioTipologia.Equals(getTriageQuery.CodDettaglioTipologia) && c.CodTipologia.Equals(getTriageQuery.CodTipologia)).FirstOrDefault();
        }
    }
}
