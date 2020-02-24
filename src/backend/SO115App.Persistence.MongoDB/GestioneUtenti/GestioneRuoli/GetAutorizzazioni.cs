using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneRuoli
{
    public class GetAutorizzazioni
    {
        private readonly DbContext _dbContext;

        public GetAutorizzazioni(DbContext dbContext)
        {
            this._dbContext = dbContext;
        }

        /// <summary>
        ///   metodo della classe che recupera i ruoli appartenenti ad un utente
        /// </summary>
        /// <param name="id">Id dell'utente su mongo</param>
        /// <returns>L'utente</returns>
        public List<Role> GetUtenteByCodice(string idUtente, string idSede)
        {
            var utente = _dbContext.UtenteCollection.Find(Builders<Utente>.Filter.Eq(x => x.Id, idUtente)).Single();

            var ListaRuoli = utente.Ruoli.FindAll(x => x.CodSede.Equals(idSede));

            return ListaRuoli;
        }
    }
}
