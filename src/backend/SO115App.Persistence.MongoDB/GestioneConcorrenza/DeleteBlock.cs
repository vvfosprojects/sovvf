using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;

namespace SO115App.Persistence.MongoDB.GestioneConcorrenza
{
    public class DeleteBlock : IDeleteBlock
    {
        private readonly DbContext _dbContext;

        public DeleteBlock(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Delete(string IdConcorrenza)
        {
            _dbContext.ConcorrenzaCollection.DeleteOne(Builders<Concorrenza>.Filter.Eq(x => x.Id, IdConcorrenza));
        }
    }
}
