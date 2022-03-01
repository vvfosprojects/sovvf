using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneConcorrenza
{
    public class GetBlockByValue : IGetBlockByValue
    {
        private readonly DbContext _dbContext;

        public GetBlockByValue(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Concorrenza Get(string value)
        {
            return _dbContext.ConcorrenzaCollection.Find(c => c.Value.Equals(value)).FirstOrDefault();
        }
    }
}
