using SO115App.Models.Classi.ServiziEsterni.NUE;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue
{
    /// <summary>
    ///   Interfaccia del servizio che restituisce il conteggio di tutte le schede contatto
    /// </summary>
    public interface IGetConteggioSchede
    {
        /// <summary>
        ///   Restituisce il conteggio delle schede contatto
        /// </summary>
        /// <param name="codiceSede">il codice Sede</param>
        /// <returns>InfoNue</returns>
        InfoNue GetConteggio(string[] codiceSede);
    }
}
