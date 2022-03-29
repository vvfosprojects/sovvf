using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Composizione;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Persistence.MongoDB.GestioneComposizioneMezzi
{
    public class SetComposizioneMezzi : ISetComposizioneMezzi
    {
        private readonly DbContext _dbContext;

        public SetComposizioneMezzi(DbContext dbContext) => _dbContext = dbContext;

        public void Set(List<ComposizioneMezzi> mezzi)
        {
            Parallel.ForEach(mezzi, mezzo =>
           {
               var filter = Builders<ComposizioneMezzi>.Filter.Eq(s => s.Id, mezzo.Id);

               if (_dbContext.ComposizioneMezziCollection.CountDocuments(filter) <= 0)
                   _dbContext.ComposizioneMezziCollection.InsertOne(mezzo);
           });
        }
    }
}
