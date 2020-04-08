using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.ExternalAPI.Fake.Classi.Utility;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.ImportOracle.GestioniUtenti
{
    /// <summary>
    ///   classe che si occupa del recupero del personale da Oracle
    /// </summary>
    public class GetPersonaleByCF : IGetPersonaleByCF
    {
        private readonly IGetPersonaleByCodSede _getListaPersonale;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="client"></param>
        /// <param name="configuration"></param>
        public GetPersonaleByCF(IGetPersonaleByCodSede getListaPersonale)
        {
            _getListaPersonale = getListaPersonale;
        }

        /// <summary>
        ///   metodo della classe che restituisce una persona fisica
        /// </summary>
        /// <param name="codiceFiscale">codice fiscale della persona</param>
        /// <param name="codSede">codice sede di riferimento</param>
        /// <returns>PersonaleVVF</returns>
        public async Task<PersonaleVVF> Get(string codiceFiscale, string codSede)
        {
            return _getListaPersonale.Get(codSede).Result.Find(x => x.CodFiscale.Equals(codiceFiscale));
        }
    }
}
