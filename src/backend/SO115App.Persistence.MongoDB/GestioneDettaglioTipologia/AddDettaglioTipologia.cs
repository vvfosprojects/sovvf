using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;
using System;
using System.Collections.Generic;
using System.Text;

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
            _dbContext.TipologiaDettaglioCollection.InsertOne(dettaglio);
        }
    }
}
