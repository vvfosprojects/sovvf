using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.GestioneComposizioneMezzi
{
    public class SetComposizioneSquadre : ISetComposizioneSquadre
    {
        private readonly DbContext _dbContext;
        public SetComposizioneSquadre(DbContext dbContext) => _dbContext = dbContext;

        public void Set(List<ComposizioneSquadra> squadre)
        {
            foreach (var squadra in squadre)
            {
                var filter = Builders<ComposizioneSquadra>.Filter.Eq(s => s.Id, squadra.Id);

                if (_dbContext.ComposizioneSquadreCollection.CountDocuments(filter) > 0)
                    _dbContext.ComposizioneSquadreCollection.ReplaceOne(filter, squadra);
                else
                    _dbContext.ComposizioneSquadreCollection.InsertOne(squadra);  
            }
        }
    }
}
