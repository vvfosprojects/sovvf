using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Servizi.Infrastruttura.GestionePartenza;

namespace SO115App.Persistence.MongoDB.GestionePartenze
{
    public class AddComposizioniPartenza : IAddComposizioniPartenza
    {
        private readonly DbContext _dbContext;
        public AddComposizioniPartenza(DbContext dbContext) => _dbContext = dbContext;

        public void AddOrUpdate(ComposizionePartenze composizionePartenze)
        {
            if (string.IsNullOrEmpty(composizionePartenze.Id))
                _dbContext.ComposizioniPartenzeCollection.InsertOne(composizionePartenze);
            else
                _dbContext.ComposizioniPartenzeCollection
                    .FindOneAndReplace(Builders<ComposizionePartenze>.Filter.Eq(c => c.Id, composizionePartenze.Id), composizionePartenze);
        }
    }
}
