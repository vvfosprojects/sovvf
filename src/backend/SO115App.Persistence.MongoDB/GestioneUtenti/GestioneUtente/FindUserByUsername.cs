using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneUtente
{
    /// <summary>
    ///   classe che recupera l'utente corrispondente all'username in input
    /// </summary>
    public class FindUserByUsername : IFindUserByUsername
    {
        private readonly DbContext _dbContext;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="dbContext"></param>
        public FindUserByUsername(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        ///   Metodo che trova l'utente corrispondente all'username
        /// </summary>
        /// <param name="username">l'username dell'utente</param>
        /// <returns>L'utente</returns>
        public Utente FindUserByUs(string username)
        {
            return _dbContext.UtenteCollection.Find(Builders<Utente>.Filter.Eq(x => x.Username, username)).Single();
        }
    }
}
