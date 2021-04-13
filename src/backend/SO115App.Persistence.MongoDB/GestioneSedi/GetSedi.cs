using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.MongoDTO;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.GestioneSedi
{
    public class GetSedi : IGetSedi
    {
        private readonly DbContext _dbContext;

        public GetSedi(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<ListaSedi> GetAll()
        {
            return _dbContext.SediCollection.Find(Builders<ListaSedi>.Filter.Empty).ToList();
        }
    }
}
