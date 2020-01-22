using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Marker;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.Marker
{
    public class GetChiamateInCorso : IGetChiamateInCorso
    {
        private readonly DbContext _dbContext;

        public GetChiamateInCorso(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<ChiamateInCorso> Get()
        {
            return _dbContext.ChiamateInCorsoCollection.Find(Builders<ChiamateInCorso>.Filter.Empty).ToList();
        }
    }
}
