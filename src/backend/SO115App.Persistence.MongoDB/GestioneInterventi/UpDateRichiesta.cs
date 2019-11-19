using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;

namespace SO115App.Persistence.MongoDB
{
    public class UpDateRichiesta : IUpDateRichiestaAssistenza
    {
        private readonly DbContext _dbContext;

        public UpDateRichiesta(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void UpDate(RichiestaAssistenza richiestaAssistenza)
        {
            var filter = Builders<RichiestaAssistenza>.Filter.Eq(s => s.Codice, richiestaAssistenza.Codice);
            _dbContext.RichiestaAssistenzaCollection.ReplaceOne(filter, richiestaAssistenza);
        }
    }
}
