using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;

namespace SO115App.Persistence.MongoDB.GestioneEmergenza
{
    public class GetEmergenzeById : IGetEmergenzaById
    {
        private readonly DbContext _dbContext;

        public GetEmergenzeById(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Emergenza Get(string Id)
        {
            return _dbContext.EmergenzaCollection.Find(Builders<Emergenza>.Filter.Eq(x => x.Id, Id)).FirstOrDefault();
        }
    }
}
