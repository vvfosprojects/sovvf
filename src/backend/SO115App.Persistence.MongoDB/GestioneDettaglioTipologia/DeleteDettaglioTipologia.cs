using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Triage;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;
using System.Collections.Generic;
using System.Linq;

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

            var values = new List<int>() { CodDettaglioTipologia };

            var listaPos = _dbContext.DtoPosCollection.Find(p => p.ListaTipologie.Any(t => t.CodTipologiaDettaglio.Any(td => td.Equals(CodDettaglioTipologia)))).ToList();
            var filtro = listaPos.Select(s => s.Id).ToList();

            foreach (var pos in listaPos)
            {
                pos.ListaTipologie = pos.ListaTipologie.Where(t => !t.CodTipologiaDettaglio.Contains(CodDettaglioTipologia)).ToList();
            }

            _dbContext.DtoPosCollection.DeleteMany(p => filtro.Contains(p.Id));
            _dbContext.DtoPosCollection.InsertMany(listaPos.AsEnumerable());

            //ELIMINO TRIAGE
            _dbContext.TriageCollection.DeleteOne(Builders<Triage>.Filter.Eq(x => x.CodDettaglioTipologia, CodDettaglioTipologia));
            _dbContext.TriageDataCollection.DeleteOne(Builders<TriageData>.Filter.Eq(x => x.CodDettaglioTipologia, CodDettaglioTipologia));
        }
    }
}
