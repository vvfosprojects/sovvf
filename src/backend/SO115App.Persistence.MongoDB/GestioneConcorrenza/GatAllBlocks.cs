using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneConcorrenza
{
    public class GatAllBlocks : IGetAllBlocks
    {
        private readonly DbContext _dbContext;

        public GatAllBlocks(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Concorrenza> GetAll(string[] CodiciSede)
        {
            var lista = _dbContext.ConcorrenzaCollection.Find(c => CodiciSede.Contains(c.CodComando)).ToList();

            return lista;
        }
    }
}
