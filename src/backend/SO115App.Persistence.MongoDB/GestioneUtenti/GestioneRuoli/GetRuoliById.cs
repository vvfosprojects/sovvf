using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneRuoli
{
    /// <summary>
    ///   classe che implementa il servizio per il reperimento dei ruoli da MongoDb
    /// </summary>
    public class GetRuoliById : IGetRuoliById
    {
        private readonly DbContext _dbContext;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="dbContext">il contesto del DB</param>
        public GetRuoliById(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        ///   il metodo della classe che recupera i ruoli dell'utente
        /// </summary>
        /// <param name="idUtente">il codice univoco dell'utente</param>
        /// <returns>una lista di ruoli</returns>
        public IEnumerable<Role> Get(string idUtente)
        {
            return _dbContext.UtenteCollection.Find(Builders<Utente>.Filter.Eq(x => x.Id, idUtente)).Single().Ruoli;
        }
    }
}
