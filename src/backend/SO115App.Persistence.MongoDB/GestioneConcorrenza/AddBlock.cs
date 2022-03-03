using Persistence.MongoDB;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;

namespace SO115App.Persistence.MongoDB.GestioneConcorrenza
{
    public class AddBlock : IAddBlock
    {
        private readonly DbContext _dbContext;

        public AddBlock(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Add(Concorrenza concorrenza)
        {
            _dbContext.ConcorrenzaCollection.InsertOne(concorrenza);
        }
    }
}
