using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System.Threading.Tasks;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneUtente
{
    /// <summary>
    ///   classe che si occupa del reperimento dell'utente a partire dal suo cf su MongoDB
    /// </summary>
    public class GetUtenteByCF : IGetUtenteByCF
    {
        private readonly DbContext _dbContext;
        private readonly IGetSedi _getSedi;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="dbContext">il contesto del db</param>
        public GetUtenteByCF(DbContext dbContext, IGetSedi getSedi)
        {
            _dbContext = dbContext;
            _getSedi = getSedi;
        }

        /// <summary>
        ///   metodo get che va ad interrogare mongoDB per reperire l'utente
        /// </summary>
        /// <param name="codiceFiscale">il codice fiscale dell'utente</param>
        /// <returns>L'utente cercato</returns>
        public Utente Get(string codiceFiscale)
        {
            var utente = _dbContext.UtenteCollection.Find(Builders<Utente>.Filter.Eq(x => x.CodiceFiscale, codiceFiscale)).SingleOrDefault();

            Parallel.ForEach(utente.Ruoli, ruolo =>
            {
                ruolo.DescSede = _getSedi.GetInfoSede(ruolo.CodSede).Result.Descrizione;
            });

            return utente;
        }
    }
}
