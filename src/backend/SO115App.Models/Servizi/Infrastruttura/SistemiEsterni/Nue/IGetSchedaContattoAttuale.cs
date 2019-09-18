using SO115App.API.Models.Classi.Soccorso;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue
{
    /// <summary>
    ///   Interfaccia del servizio che restituisce una scheda contatto
    /// </summary>
    public interface IGetSchedaContattoAttuale
    {
        /// <summary>
        ///   Restituisce la scheda contatto secondo i parametri indicati
        /// </summary>
        /// <returns>La scheda contatto</returns>
        SchedaContatto GetSchedaContattoAttuale(string CodiceSede, string CodicePostazioneOperatore);
    }
}
