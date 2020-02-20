using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneUtente
{
    /// <summary>
    ///   classe che recupera l'utente a partire dal suo id
    /// </summary>
    public class GetUtenteById : IGetUtenteById
    {
        private readonly DbContext _dbContext;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="dbContext"></param>
        public GetUtenteById(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        ///   metodo della classe che recupera l'utente a partire dall'id
        /// </summary>
        /// <param name="id">il id dell'utente su mongo</param>
        /// <returns>L'utente</returns>
        public Utente GetUtenteByCodice(string id)
        {
            return _dbContext.UtenteCollection.Find(Builders<Utente>.Filter.Eq(x => x.Id, id)).Single();
        }
    }
}
