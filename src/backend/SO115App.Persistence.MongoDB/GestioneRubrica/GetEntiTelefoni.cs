using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneRubrica
{
    public class GetEntiTelefoni : IGetEnteTelefoni
    {
        private readonly DbContext _dbContext;
        public GetEntiTelefoni(DbContext dbContext) => _dbContext = dbContext;

        public List<EnteTelefoni> Get(string[] codici)
        {
            return _dbContext.TelefoniCollection.Find(c => codici.Contains(c.Codice)).ToList();
        }
    }
}
