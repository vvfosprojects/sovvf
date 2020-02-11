using SO115App.ExternalAPI.Fake.Servizi.Nue.Mock;
using SO115App.Models.Classi.ServiziEsterni.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;

namespace SO115App.ExternalAPI.Fake.Servizi.Nue
{
    /// <summary>
    ///   Classe del servizio mock che restituisce il conteggio delle schede contatto per classificazione
    /// </summary>
    public class GetConteggioSchede : IGetConteggioSchede
    {
        private readonly GetSchedeMethods _getSchedeMethods;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        public GetConteggioSchede(GetSchedeMethods getSchedeMethods)
        {
            _getSchedeMethods = getSchedeMethods;
        }

        /// <summary>
        ///   Restituisce il conteggio delle schede contatto
        /// </summary>
        /// <param name="codiceSede">il codice Sede</param>
        /// <returns>InfoNue</returns>
        public InfoNue GetConteggio(string codiceSede)
        {
            //---------------TODO Implementazione con il servizio esterno reale che sostituirà i json

            return _getSchedeMethods.GetConteggio(codiceSede);

            //---------------------------------------------------------------------------------------
        }
    }
}
