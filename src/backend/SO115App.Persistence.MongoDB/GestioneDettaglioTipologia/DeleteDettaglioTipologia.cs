using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;

namespace SO115App.Persistence.MongoDB.GestioneDettaglioTipologia
{
    public class DeleteDettaglioTipologia : IDeleteDettaglioTipologia
    {
        private readonly DbContext _dbContext;

        public DeleteDettaglioTipologia(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Delete(int CodDettaglioTipologia)
        {
            _dbContext.TipologiaDettaglioCollection.DeleteOne(Builders<TipologiaDettaglio>.Filter.Eq(x => x.CodiceDettaglioTipologia, CodDettaglioTipologia));
        }
    }
}
