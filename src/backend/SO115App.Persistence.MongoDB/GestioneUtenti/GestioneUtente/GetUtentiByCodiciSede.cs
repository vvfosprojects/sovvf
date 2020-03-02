using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using System;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneUtente
{
    /// <summary>
    ///   classe che si occupa di reperire tutti gli utenti nei cui ruoli è presente uno o più
    ///   codice sede passati in firma
    /// </summary>
    public class GetUtentiByCodiciSede : IGetUtentiByCodiciSedi
    {
        private readonly DbContext _dbContext;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="dbContext">il contesto del db</param>
        public GetUtentiByCodiciSede(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        ///   metodo che reperisce gli utenti dal DB
        /// </summary>
        /// <param name="codiciSede">i codici sede</param>
        /// <param name="cercaBy">la stringa per la ricerca</param>
        /// <returns>una lista di utenti</returns>
        public List<Utente> Get(List<string> codiciSede, string cercaBy = null)
        {
            return string.IsNullOrEmpty(cercaBy)
                ? _dbContext.UtenteCollection.Find(Builders<Utente>.Filter.In("ruoli.codSede", codiciSede)).ToList()
                : _dbContext.UtenteCollection.Find(Builders<Utente>.Filter.In("ruoli.codSede", codiciSede)).ToList().FindAll(x => x.Nome.Contains(cercaBy, StringComparison.InvariantCultureIgnoreCase) || x.Cognome.Contains(cercaBy, StringComparison.InvariantCultureIgnoreCase));
        }
    }
}
