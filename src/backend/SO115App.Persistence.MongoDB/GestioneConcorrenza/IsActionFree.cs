using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneConcorrenza
{
    public class IsActionFree : IIsActionFree
    {
        private readonly DbContext _dbContext;

        public IsActionFree(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool Check(string action)
        {
            var listaAzioniBloccate = _dbContext.ConcorrenzaCollection.Find(c => c.Id != null).ToList();

            return false;
        }
    }
}
