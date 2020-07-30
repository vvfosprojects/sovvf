using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.Rubrica;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneRubrica
{
    public class UpDateRubrica : IUpDateRubrica
    {
        private readonly DbContext _dbContext;

        public UpDateRubrica(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void UpDate(EnteIntervenuto ente)
        {
            var filter = Builders<EnteIntervenuto>.Filter.Eq(s => s.Codice, ente.Codice);
            _dbContext.RubricaCollection.ReplaceOne(filter, ente);
        }
    }
}
