using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneUtente
{
    public class VerificaLogIn : IVerificaLogIn
    {
        private readonly DbContext _dbContext;

        public VerificaLogIn(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Utente Verifica(string username, string password)
        {
            var builder = Builders<Utente>.Filter;
            var filter = builder.And(builder.Eq(x => x.Username, username), builder.Eq(x => x.Password, password));
            return _dbContext.UtenteCollection.Find(filter).Single();
        }
    }
}
