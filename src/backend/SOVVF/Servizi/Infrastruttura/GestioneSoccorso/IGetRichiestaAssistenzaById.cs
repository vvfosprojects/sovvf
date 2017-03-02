using Modello.Classi.Soccorso;

namespace Modello.Servizi.Infrastruttura.GestioneSoccorso
{
    /// <summary>
    ///   Servizio di erogazione del contenuto di una Richiesta di Assistenza
    /// </summary>
    public interface IGetRichiestaAssistenzaById
    {
        /// <summary>
        ///   Restituisce una Richiesta di Assistenza
        /// </summary>
        /// <param name="idRichiestaAssistenza">Identificativo della Richiesta di Assistenza</param>
        /// <returns>La Richiesta di Assistenza</returns>
        RichiestaAssistenza Get(string idRichiestaAssistenza);
    }
}
