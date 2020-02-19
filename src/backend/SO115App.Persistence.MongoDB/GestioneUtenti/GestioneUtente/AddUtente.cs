using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneUtente
{
    public class AddUtente : IAddUtente
    {
        private readonly DbContext _dbContext;

        public AddUtente(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Add(Utente utente)
        {            
            _dbContext.UtenteCollection.InsertOne(utente);
        }
    }
}
