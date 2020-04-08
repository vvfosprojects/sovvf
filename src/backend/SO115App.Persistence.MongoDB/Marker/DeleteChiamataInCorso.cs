using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Marker;
using SO115App.Models.Servizi.Infrastruttura.Marker;

namespace SO115App.Persistence.MongoDB.Marker
{
    public class DeleteChiamataInCorso : IDeleteChiamataInCorso
    {
        private readonly DbContext _dbContext;

        public DeleteChiamataInCorso(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        void IDeleteChiamataInCorso.DeleteChiamataInCorso(string IdChiamataInCorso)
        {
            _dbContext.ChiamateInCorsoCollection.DeleteOne(Builders<ChiamateInCorso>.Filter.Eq(x => x.Id, IdChiamataInCorso));
        }
    }
}
