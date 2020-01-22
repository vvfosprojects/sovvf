using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Marker;
using SO115App.Models.Servizi.Infrastruttura.Marker;

namespace SO115App.Persistence.MongoDB.Marker
{
    public class UpdateChiamataInCorso : IUpDateChiamataInCorso

    {
        private readonly DbContext _dbContext;

        public void UpDateChiamata(ChiamateInCorso chiamata)
        {
            _dbContext.ChiamateInCorsoCollection.ReplaceOne(Builders<ChiamateInCorso>.Filter.Eq(x => x.Id, chiamata.Id), chiamata);
        }
    }
}
