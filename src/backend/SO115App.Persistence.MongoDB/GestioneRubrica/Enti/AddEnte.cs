using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;

namespace SO115App.Persistence.MongoDB.GestioneRubrica.Enti
{
    public class AddEnte : IAddEnte
    {
        private readonly DbContext _dbContext;
        public AddEnte(DbContext dbContext) => _dbContext = dbContext;

        public void Add(EnteIntervenuto ente)
        {
            var codice = _dbContext.RubricaCollection.Find(x => true).SortByDescending(c => c.Codice).First().Codice;
            ente.Codice = codice + 1;

            _dbContext.RubricaCollection.InsertOne(ente);
        }
    }
}
