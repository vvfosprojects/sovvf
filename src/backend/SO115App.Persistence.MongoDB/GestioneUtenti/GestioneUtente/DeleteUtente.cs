using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneUtente
{
    public class DeleteUtente : IDeleteUtente
    {
        private readonly DbContext _dBContext;

        public DeleteUtente(DbContext dBContext)
        {
            _dBContext = dBContext;
        }

        public void Delete(string codFisc)
        {
            _dBContext.UtenteCollection.FindOneAndDelete(Builders<Utente>.Filter.Eq(x => x.CodiceFiscale, codFisc));
        }
    }
}
