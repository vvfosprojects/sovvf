using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneUtente
{
    public class UpDateHubConnenction : IUpDateHubConId
    {
        private readonly DbContext _dbContext;

        public UpDateHubConnenction(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void UpDate(string HubConId, string IdUtente)
        {
            _dbContext.UtenteCollection.UpdateOne(Builders<Utente>.Filter.Eq(x => x.Id, IdUtente), Builders<Utente>.Update.AddToSet("HubConId", HubConId));
        }
    }
}
