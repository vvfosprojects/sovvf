using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneUtente
{
    /// <summary>
    ///   classe che si occupa di reperire tutti gli utenti nei cui ruoli è presente uno o più
    ///   codice sede passati in firma
    /// </summary>
    public class GetUtentiByCodiciSede : IGetUtentiByCodiciSedi
    {
        private readonly DbContext _dbContext;
        private readonly IGetSedi _getSedi;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="dbContext">il contesto del db</param>
        public GetUtentiByCodiciSede(DbContext dbContext, IGetSedi getSedi)
        {
            _dbContext = dbContext;
            _getSedi = getSedi;
        }

        /// <summary>
        ///   metodo che reperisce gli utenti dal DB
        /// </summary>
        /// <param name="codiciSede">i codici sede</param>
        /// <param name="cercaBy">la stringa per la ricerca</param>
        /// <returns>una lista di utenti</returns>
        public List<Utente> Get(List<string> codiciSede, string cercaBy = null)
        {
            string[] lstSegmenti = new string[6];
            if (cercaBy != null)
                lstSegmenti = cercaBy.ToLower().Split(" ", StringSplitOptions.RemoveEmptyEntries);

            //CREO INDICE SULLA TABELLA UTENTI SU TUTTI I CAMPI
            var indexWildcardTextSearch = new CreateIndexModel<Utente>(Builders<Utente>.IndexKeys.Text("$**"));
            List<CreateIndexModel<Utente>> indexes = new List<CreateIndexModel<Utente>>();
            indexes.Add(indexWildcardTextSearch);
            _dbContext.UtenteCollection.Indexes.CreateMany(indexes);

            var lista = string.IsNullOrEmpty(cercaBy)
                ? _dbContext.UtenteCollection.Find(Builders<Utente>.Filter.In("ruoli.codSede", codiciSede)).ToList()
                    .OrderByDescending(x => x.Nome)
                    .ThenByDescending(x => x.Cognome)
                    .ToList()

                : _dbContext.UtenteCollection.Find(Builders<Utente>.Filter.In("ruoli.codSede", codiciSede)).ToList();

            var filtroByKeySearch = new List<Utente>();
            if (cercaBy != null)
                filtroByKeySearch = lista.FindAll(x => (x.Nome.ToLower() + " " + x.Cognome.ToLower()).Contains(cercaBy.ToLower())
                                                    || (x.Cognome.ToLower() + " " + x.Nome.ToLower()).Contains(cercaBy.ToLower()))
                        .OrderByDescending(x => x.Nome)
                        .ThenByDescending(x => x.Cognome)
                        .ToList();
            else
                filtroByKeySearch = lista.OrderByDescending(x => x.Nome)
                                         .ThenByDescending(x => x.Cognome)
                                         .ToList();


            Parallel.ForEach(filtroByKeySearch, utente =>
            {
                foreach(var ruolo in utente.Ruoli)
                {
                    ruolo.DescSede = _getSedi.GetInfoSede(ruolo.CodSede).Result.Descrizione;
                }
            });




            return filtroByKeySearch;

            //_dbContext.UtenteCollection.Find(Builders<Utente>.Filter.In("ruoli.codSede", codiciSede)).ToList()
            //        .FindAll(x =>
            //            lstSegmenti.Any(c => x.Nome.ToLower().Contains(c))
            //            || lstSegmenti.Any(c => x.Cognome.ToLower().Contains(c)
            //            || lstSegmenti.Any(c => x.Sede.Codice.Replace(".", "").ToLower().Contains(c))))
            //        .OrderByDescending(x => x.Nome)
            //        .ThenByDescending(x => x.Cognome)
            //        .ToList();
        }
    }
}
