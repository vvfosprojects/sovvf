using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;

namespace SO115App.Persistence.MongoDB.GestioneConcorrenza
{
    public class DeleteAllBlocks : IDeleteAllBlocks
    {
        private readonly DbContext _dbContext;

        public DeleteAllBlocks(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void DeleteAll(string IdOperatore)
        {
            _dbContext.ConcorrenzaCollection.DeleteMany(Builders<Concorrenza>.Filter.Eq(x => x.IdOperatore, IdOperatore));
        }
    }
}
