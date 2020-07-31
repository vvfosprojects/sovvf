using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneRubrica
{
    public class GetEnteCategorie : IGetEnteCategorie
    {
        private readonly DbContext _dbContext;
        public GetEnteCategorie(DbContext dbContext) => _dbContext = dbContext;

        public List<EnteCategoria> Get(int[] codici)
        {
            return _dbContext.CategorieEntiCollection.Find(c => codici.Contains(int.Parse(c.Codice))).ToList();
        }
    }
}
