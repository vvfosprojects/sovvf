using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneRuoli
{
    public class GetAutorizzazioni : IGetAutorizzazioni
    {
        private readonly DbContext _dbContext;
        private readonly IGetAlberaturaUnitaOperative _getListaUO;

        public GetAutorizzazioni(DbContext dbContext, IGetAlberaturaUnitaOperative getListaUO)
        {
            _dbContext = dbContext;
            _getListaUO = getListaUO;
        }

        /// <summary>
        ///   metodo della classe che recupera i ruoli appartenenti ad un utente
        /// </summary>
        /// <param name="id">Id dell'utente su mongo</param>
        /// <returns>L'utente</returns>
        public List<Role> GetAutorizzazioniUtente(string idUtente, string idSede)
        {
            var utente = _dbContext.UtenteCollection.Find(Builders<Utente>.Filter.Eq(x => x.Id, idUtente)).Single();

            //Se trovo un ruolo per il codice sede inviato riempio la lista dei ruoli appartenenti all'utente per la sede selezionata e ritorno il risultato
            var ListaRuoli = utente.Ruoli.FindAll(x => x.CodSede.Equals(idSede));

            // Se NON trovo un ruolo per il codice sede inviato ciclo l'alberatura delle sedi per
            // cercare il padre o un discendente del codice inviato. Trovato il padre cerco i ruoli
            // dell'utente per il codice del padre e se non trovo risultati cerco i ruoli per i
            // discendenti diretti del padre
            if (ListaRuoli.Count == 0)
            {
                string CodSedePadreL3 = "";
                string CodSedePadreL2 = "";
                string CodSedePadreL1 = "";

                var ListaUOCON = _getListaUO.ListaSediAlberata();

                foreach (UnitaOperativa unitaCON in (ListaUOCON.GetSottoAlbero().ToList()))
                {
                    var IsFiglio = unitaCON.GetSottoAlbero().ToList().Find(x => x.Codice.Equals(idSede));

                    if (IsFiglio != null)
                    {
                        CodSedePadreL3 = unitaCON.Codice;
                    }
                    else
                    {
                        foreach (UnitaOperativa UODirRegionale in (List<UnitaOperativa>)unitaCON.GetSottoAlbero())
                        {
                            var IsFiglioL2 = UODirRegionale.GetSottoAlbero().ToList().Find(x => x.Codice.Equals(idSede));

                            if (IsFiglioL2 != null)
                            {
                                CodSedePadreL2 = UODirRegionale.Codice;
                                CodSedePadreL3 = unitaCON.Codice;
                            }
                            else
                            {
                                foreach (UnitaOperativa UOComando in (List<UnitaOperativa>)UODirRegionale.GetSottoAlbero())
                                {
                                    var IsFiglioL3 = UOComando.GetSottoAlbero().ToList().Find(x => x.Codice.Equals(idSede));

                                    if (IsFiglioL3 != null)
                                    {
                                        CodSedePadreL1 = UOComando.Codice;
                                        CodSedePadreL2 = UODirRegionale.Codice;
                                        CodSedePadreL3 = unitaCON.Codice;
                                    }
                                }
                            }
                        }
                    }
                }

                if (CodSedePadreL1.Trim().Length > 0)
                    ListaRuoli = utente.Ruoli.FindAll(x => x.CodSede.Equals(CodSedePadreL1));

                if (ListaRuoli.Count == 0)
                    ListaRuoli = utente.Ruoli.FindAll(x => x.CodSede.Equals(CodSedePadreL2));

                if (ListaRuoli.Count == 0)
                    ListaRuoli = utente.Ruoli.FindAll(x => x.CodSede.Equals(CodSedePadreL3));
            }

            return ListaRuoli;
        }
    }
}
