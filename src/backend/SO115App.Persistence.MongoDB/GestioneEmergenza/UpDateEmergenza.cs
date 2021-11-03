using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;

namespace SO115App.Persistence.MongoDB.GestioneEmergenza
{
    internal class UpDateEmergenza : IUpDateEmergenza
    {
        private readonly DbContext _dbContext;

        public UpDateEmergenza(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Update(Emergenza emergenza)
        {
            var filter = Builders<Emergenza>.Filter.Eq(s => s.CodEmergenza, emergenza.CodEmergenza);
            _dbContext.EmergenzaCollection.ReplaceOne(filter, emergenza);
        }
    }
}
