using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Pos;
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
            var listaPos = _dbContext.DtoPosCollection.Find(p => p.ListaTipologie.Any(t => t.CodTipologiaDettaglio.Contains(CodDettaglioTipologia))).ToList();

            foreach (var pos in listaPos)
            {
                int dettagliTotCount = pos.ListaTipologie.SelectMany(t => t.CodTipologiaDettaglio).Count();
                var nuovaListaTipologie = pos.ListaTipologie.Where(t => t.CodTipologiaDettaglio.Contains(CodDettaglioTipologia)).ToList();
                int dettagliDaEliminareCount = pos.ListaTipologie.SelectMany(t => t.CodTipologiaDettaglio).Where(td => td.Equals(CodDettaglioTipologia)).Count();

                //PROCEDO CON L'ELIMINAZIONE DEL DETTAGLIO
                if(dettagliTotCount == dettagliDaEliminareCount)
                {
                    //DELETE POS
                    _dbContext.DtoPosCollection.DeleteOne(p => p.Id.Equals(pos.Id));
                }
                else
                {
                    foreach (var tipologia in nuovaListaTipologie)
                    {
                        tipologia.CodTipologiaDettaglio.Remove(CodDettaglioTipologia);
                    }

                    //UPDATE POS
                    _dbContext.DtoPosCollection.DeleteOne(p => p.Id.Equals(pos.Id));
                    _dbContext.DtoPosCollection.InsertOne(pos);
                }
            }

            //ELIMINO TRIAGE
            _dbContext.TriageCollection.DeleteOne(Builders<Triage>.Filter.Eq(x => x.CodDettaglioTipologia, CodDettaglioTipologia));
            _dbContext.TriageDataCollection.DeleteOne(Builders<TriageData>.Filter.Eq(x => x.CodDettaglioTipologia, CodDettaglioTipologia));

            //ELIMINO DETTAGLIO
            _dbContext.TipologiaDettaglioCollection.DeleteOne(Builders<TipologiaDettaglio>.Filter.Eq(x => x.CodiceDettaglioTipologia, CodDettaglioTipologia));
        }
    }
}
