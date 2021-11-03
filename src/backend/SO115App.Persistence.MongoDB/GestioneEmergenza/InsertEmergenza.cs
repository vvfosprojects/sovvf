using Persistence.MongoDB;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;

namespace SO115App.Persistence.MongoDB.GestioneEmergenza
{
    internal class InsertEmergenza : IInsertEmergenza
    {
        private readonly DbContext _dbContext;

        public InsertEmergenza(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Insert(Emergenza emergenza)
        {
            _dbContext.EmergenzaCollection.InsertOne(emergenza);
        }
    }
}
