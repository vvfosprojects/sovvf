using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;

namespace SO115App.Persistence.MongoDB.GestioneRubrica.Enti
{
    public class DeleteEnte : IDeleteEnte
    {
        private readonly DbContext _dbContext;

        public DeleteEnte(DbContext dbContext) => _dbContext = dbContext;

        public void Delete(string id)
        {
            _dbContext.RubricaCollection.FindOneAndDelete(Builders<EnteIntervenuto>.Filter.Eq(x => x.Id, id));
        }
    }
}
