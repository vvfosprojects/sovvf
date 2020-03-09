using SO115App.Models.Classi.Utenti.Autenticazione;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale
{
    /// <summary>
    ///   servizio che si occupa di recuperare la singola persona fisica dall'anagrafica personale
    ///   partendo dal suo codice fiscale
    /// </summary>
    public interface IGetPersonaleByCF
    {
        /// <summary>
        ///   metodo reperisce la persona fisica
        /// </summary>
        /// <param name="codiceFiscale">il codice fiscale della persona</param>
        /// <param name="codSede">di default null</param>
        /// <returns>La persona fisica</returns>
        Task<PersonaleVVF> Get(string codiceFiscale, string codSede = null);
    }
}
