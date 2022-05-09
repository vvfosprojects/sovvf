using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Pos;
using SO115App.Models.Classi.Triage;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;
using System.Collections.Generic;

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

            //var values = new List<int>() { CodDettaglioTipologia };
            //_dbContext.DtoPosCollection.Find(Builders<PosDAO>.Filter.AnyIn(x => x.ListaTipologie, values));


            //ELIMINO TRIAGE
            _dbContext.TriageCollection.DeleteOne(Builders<Triage>.Filter.Eq(x => x.CodDettaglioTipologia, CodDettaglioTipologia));
            _dbContext.TriageDataCollection.DeleteOne(Builders<TriageData>.Filter.Eq(x => x.CodDettaglioTipologia, CodDettaglioTipologia));
        }
    }
}
