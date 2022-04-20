using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.Composizione;

namespace SO115App.Persistence.MongoDB.GestioneComposizioneMezzi
{
    public class SetComposizioneSquadre : ISetComposizioneSquadre
    {
        private readonly DbContext _dbContext;

        public SetComposizioneSquadre(DbContext dbContext) => _dbContext = dbContext;

        public void Set(WorkShift workshift)
        {
            var filter = Builders<WorkShift>.Filter.Eq(s => s.Distaccamento, workshift.Distaccamento);

            _dbContext.SquadreCollection.ReplaceOne(filter, workshift);
        }
    }
}
