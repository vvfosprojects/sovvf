using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneRubrica
{
    public class GetRubrica : IGetRubrica
    {
        private readonly DbContext _dbContext;

        public GetRubrica(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<EnteIntervenuto> Get()
        {
            return _dbContext.RubricaCollection.Find(Builders<EnteIntervenuto>.Filter.Empty).ToList();
        }

        public List<EnteIntervenuto> Get(string CodSede, bool Ricorsivo)
        {
            return _dbContext.RubricaCollection.Find(x => x.CodSede == CodSede && x.Ricorsivo == Ricorsivo).ToList();
        }

        public List<EnteIntervenuto> Get(string[] CodSede, bool Ricorsivo)
        {
            return _dbContext.RubricaCollection.Find(x => CodSede.Contains(x.CodSede) && x.Ricorsivo == Ricorsivo).ToList();
        }
    }
}
