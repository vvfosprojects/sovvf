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

        public void Delete(int CodDettaglio, int CodTipologia)
        {
            var listaPos = _dbContext.DtoPosCollection.Find(p => p.ListaTipologie.Any(t => t.CodTipologia.Equals(CodTipologia) && t.CodTipologiaDettaglio.Contains(CodDettaglio))).ToList();

            foreach (var pos in listaPos)
            {
                int dettagliTotCount = pos.ListaTipologie.SelectMany(t => t.CodTipologiaDettaglio).Count();
                var nuovaListaTipologie = pos.ListaTipologie.Where(t => t.CodTipologia.Equals(CodTipologia) && t.CodTipologiaDettaglio.Contains(CodDettaglio)).ToList();
                int dettagliDaEliminareCount = pos.ListaTipologie.Where(t => t.CodTipologia.Equals(CodTipologia) && t.CodTipologiaDettaglio.Contains(CodDettaglio)).SelectMany(t => t.CodTipologiaDettaglio).Where(c => c.Equals(CodDettaglio)).Count();

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
                        tipologia.CodTipologiaDettaglio.Remove(CodDettaglio);
                    }

                    //UPDATE POS
                    _dbContext.DtoPosCollection.DeleteOne(p => p.Id.Equals(pos.Id));
                    _dbContext.DtoPosCollection.InsertOne(pos);
                }
            }

            //ELIMINO TRIAGE
            _dbContext.TriageCollection.DeleteOne(Builders<Triage>.Filter.Eq(x => x.CodDettaglioTipologia, CodDettaglio));
            _dbContext.TriageDataCollection.DeleteOne(Builders<TriageData>.Filter.Eq(x => x.CodDettaglioTipologia, CodDettaglio));

            //ELIMINO DETTAGLIO
            _dbContext.TipologiaDettaglioCollection.DeleteOne(Builders<TipologiaDettaglio>.Filter.Eq(x => x.CodiceTipologia, CodTipologia) & Builders<TipologiaDettaglio>.Filter.Eq(x => x.CodiceDettaglioTipologia, CodDettaglio));
        }
    }
}
