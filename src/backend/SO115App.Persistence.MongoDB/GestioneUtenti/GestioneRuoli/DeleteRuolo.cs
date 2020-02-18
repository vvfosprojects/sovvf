using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneRuoli
{
    public class DeleteRuolo : IDeleteRuolo
    {
        private readonly DbContext _dbcontext;

        public DeleteRuolo(DbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public void Delete(string codiceFiscale, Role ruolo)
        {
            var filter = Builders<Utente>.Filter.Eq(x => x.CodiceFiscale, codiceFiscale);
            _dbcontext.UtenteCollection.UpdateOne(filter, Builders<Utente>.Update.Pull(x => x.Ruoli, ruolo));
        }
    }
}
