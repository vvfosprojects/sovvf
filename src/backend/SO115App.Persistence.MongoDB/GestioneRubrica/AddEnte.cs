using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica;

namespace SO115App.Persistence.MongoDB.GestioneRubrica
{
    public class AddEnte : IAddEnte
    {
        private readonly DbContext _dbContext;
        public AddEnte(DbContext dbContext) => _dbContext = dbContext;

        public void Add(EnteIntervenuto ente)
        {
            _dbContext.RubricaCollection.InsertOne(ente);
        }
    }
}
