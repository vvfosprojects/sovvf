using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneRubrica
{
    public class GetEntiCategoria : IGetEnteCategorie
    {
        private readonly DbContext _dbContext;
        public GetEntiCategoria(DbContext dbContext) => _dbContext = dbContext;

        public List<EnteCategoria> Get(int[] codici)
        {
            return _dbContext.EnteCategoriaCollection.Find(c => codici.Contains(c.Codice)).ToList();
        }
    }
}
