using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica;

namespace SO115App.Persistence.MongoDB.GestioneRubrica
{
    public class UpdateEnte : IUpdateEnte
    {
        private readonly DbContext _dbContext;
        public UpdateEnte(DbContext dbContext) => _dbContext = dbContext;

        public void Update(EnteIntervenuto ente)
        {
            //_dbContext.RubricaCollection.FindOneAndUpdate();
        }
    }
}
