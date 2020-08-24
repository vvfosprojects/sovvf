using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate;

namespace SO115App.Persistence.MongoDB.GestioneTrasferimentiChiamate
{
    public class AddTrasferimento : IAddTrasferimento
    {
        private readonly DbContext _dbContext;
        public AddTrasferimento(DbContext dbContext) => _dbContext = dbContext;


        public void Add(TrasferimentoChiamata trasferimento, RichiestaAssistenza richiesta)
        {
            //TODO AGGIUNGERE TRANSAZIONE

            _dbContext.TrasferimentiChiamateCollection.InsertOne(trasferimento);

            _dbContext.RichiestaAssistenzaCollection.FindOneAndReplace(c => c.Id == richiesta.Id, richiesta);
        }
    }
}
