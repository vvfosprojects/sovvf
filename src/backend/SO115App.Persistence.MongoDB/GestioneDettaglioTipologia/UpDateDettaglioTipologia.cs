using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneDettaglioTipologia
{
    public class UpDateDettaglioTipologia : IModifyDettaglioTipologia
    {
        private readonly DbContext _dbContext;

        public UpDateDettaglioTipologia(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Modify(TipologiaDettaglio dettaglio)
        {
            var filter = Builders<TipologiaDettaglio>.Filter.Eq(s => s.CodiceDettaglioTipologia, dettaglio.CodiceDettaglioTipologia);

            _dbContext.TipologiaDettaglioCollection.ReplaceOne(filter, dettaglio);
        }
    }
}
