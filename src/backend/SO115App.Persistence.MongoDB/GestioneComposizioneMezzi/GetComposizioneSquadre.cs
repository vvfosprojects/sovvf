using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.GestioneComposizioneMezzi
{
    public class GetComposizioneSquadre : IGetComposizioneSquadreDB
    {
        private readonly DbContext _dbContext;
        public GetComposizioneSquadre(DbContext dbContext) => _dbContext = dbContext;

        public List<ComposizioneSquadra> Get()
        {
            var result = _dbContext.ComposizioneSquadreCollection.Find(Builders<ComposizioneSquadra>.Filter.Empty).ToList();

            return result;
        }
    }
}
