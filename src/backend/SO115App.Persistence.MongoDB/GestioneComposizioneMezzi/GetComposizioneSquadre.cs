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

        //public WorkShift GetByCodiceSede(string codiceSede)
        //{
        //    if (string.IsNullOrEmpty(codiceSede))
        //    {
        //        var result = _dbContext.SquadreCollection.Find(Builders<WorkShift>.Filter.Empty).FirstOrDefault();

        //        return result;
        //    }
        //    else
        //    {
        //        var result = _dbContext.SquadreCollection.Find(Builders<WorkShift>.Filter.Eq(s => s., codiceSede)).ToList();

        //        return result;
        //    }
        //}
    }
}
