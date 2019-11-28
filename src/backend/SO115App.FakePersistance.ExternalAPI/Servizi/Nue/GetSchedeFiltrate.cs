using SO115App.ExternalAPI.Fake.Servizi.Nue.Mock;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Servizi.Nue
{
    /// <summary>
    ///   Classe che restituisce tutte le schede contatto in accordo con i filtri immessi
    /// </summary>
    public class GetSchedeFiltrate : IGetSchedeFiltrate
    {
        private readonly GetSchedeMethods _getSchedeMethods;

        public GetSchedeFiltrate(GetSchedeMethods getSchedeMethods)
        {
            _getSchedeMethods = getSchedeMethods;
        }

        /// <summary>
        ///   Metodo che invia la richiesta per il reperimento di tutte le schede filtrate
        /// </summary>
        /// <param name="text">stringa text</param>
        /// <param name="gestita">booleana gestita</param>
        /// <param name="letta">booleana letta</param>
        /// <param name="codiceFiscale">stringa codicefiscale</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> Get(string text, bool? gestita, bool? letta, string codiceFiscale)
        {
            //---------------TODO Implementazione con il servizio esterno reale che sostituirà i json

            return _getSchedeMethods.GetFiltered(text, gestita, letta, codiceFiscale);

            //---------------------------------------------------------------------------------------
        }
    }
}
