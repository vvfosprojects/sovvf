using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;

namespace SO115App.Persistence.MongoDB.GestioneRubrica.Enti
{
    public class UpdateEnte : IUpdateEnte
    {
        private readonly DbContext _dbContext;

        public UpdateEnte(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Update(EnteIntervenuto ente)
        {
            var filter = Builders<EnteIntervenuto>.Filter.Eq(s => s.Codice, ente.Codice);

            _dbContext.RubricaCollection.ReplaceOne(filter, ente);
        }
    }
}
