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
            _dbContext.SquadreCollection.InsertOne(workshift);
        }
    }
}
