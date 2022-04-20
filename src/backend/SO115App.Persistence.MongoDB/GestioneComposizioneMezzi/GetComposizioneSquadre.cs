using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.Composizione;

namespace SO115App.Persistence.MongoDB.GestioneComposizioneMezzi
{
    public class GetComposizioneSquadre : IGetComposizioneSquadreDB
    {
        private readonly DbContext _dbContext;

        public GetComposizioneSquadre(DbContext dbContext) => _dbContext = dbContext;

        public WorkShift Get()
        {
            var result = _dbContext.SquadreCollection.Find(Builders<WorkShift>.Filter.Empty).FirstOrDefault();

            return result;
        }

        public WorkShift GetByCodiceDistaccamento(string codice)
        {
            WorkShift ws = new WorkShift();
            try
            {
                return _dbContext.SquadreCollection.Find(s => s.Distaccamento.Contains(codice)).FirstOrDefault();
            }
            catch
            {
                return ws;
            }
        }
    }
}
