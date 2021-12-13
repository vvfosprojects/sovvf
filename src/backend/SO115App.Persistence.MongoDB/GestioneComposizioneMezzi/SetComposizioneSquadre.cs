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
                _dbContext.ComposizioneSquadreCollection.ReplaceOne(Builders<ComposizioneSquadra>.Filter.Eq(f => f.Codice, squadra.Codice), squadra);
            }
        }
    }
}
