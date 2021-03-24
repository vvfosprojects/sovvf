using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;

namespace SO115App.Persistence.MongoDB.GestioneDettaglioTipologia
{
    public class AddDettaglioTipologia : IAddDettaglioTipologia
    {
        private readonly DbContext _dbContext;

        public AddDettaglioTipologia(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Add(TipologiaDettaglio dettaglio)
        {
            var MaxDettaglio = _dbContext.TipologiaDettaglioCollection.Find(_ => true).SortByDescending(d => d.CodiceDettaglioTipologia).Limit(1).FirstOrDefaultAsync().Result;

            dettaglio.CodiceDettaglioTipologia = MaxDettaglio != null ? MaxDettaglio.CodiceDettaglioTipologia + 1 : 1;

            _dbContext.TipologiaDettaglioCollection.InsertOne(dettaglio);
        }
    }
}
