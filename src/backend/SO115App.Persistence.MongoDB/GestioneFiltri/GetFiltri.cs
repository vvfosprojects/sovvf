using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Filtri;
using SO115App.Models.Servizi.Infrastruttura.GetFiltri;

namespace SO115App.Persistence.MongoDB.GestioneFiltri
{
    public class GetFiltri : IGetFiltri
    {
        private readonly DbContext _dbContext;

        public GetFiltri(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Filtri Get()
        {
            return _dbContext.FiltriCollection.Find(Builders<Filtri>.Filter.Empty).Single();
        }
    }
}
