using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.GestioneSedi;

namespace SO115App.Persistence.MongoDB.GestioneSedi
{
    public class SetListaSediAlberate : ISetSediAlberate
    {
        private readonly DbContext _dbContext;

        public SetListaSediAlberate(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Set(UnitaOperativa unitaOperativa)
        {
            var filter = Builders<UnitaOperativa>.Filter.Eq(s => s.Codice, "00");

            if (_dbContext.ListaSediCollection.CountDocuments(filter) > 0)
                _dbContext.ListaSediCollection.ReplaceOne(filter, unitaOperativa);
            else
                _dbContext.ListaSediCollection.InsertOne(unitaOperativa);
        }
    }
}
