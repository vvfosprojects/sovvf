using Persistence.MongoDB;
using SO115App.Models.Classi.Marker;
using SO115App.Models.Servizi.Infrastruttura.Marker;

namespace SO115App.Persistence.MongoDB.Marker
{
    internal class AddChiamataInCorso : IAddChiamataInCorso
    {
        private readonly DbContext _dbContext;

        public AddChiamataInCorso(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Add(ChiamateInCorso chiamata)
        {
            _dbContext.ChiamateInCorsoCollection.InsertOne(chiamata);
        }
    }
}
