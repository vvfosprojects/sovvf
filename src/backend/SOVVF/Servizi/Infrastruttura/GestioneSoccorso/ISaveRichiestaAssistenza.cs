using Modello.Classi.Soccorso;

namespace Modello.Servizi.Infrastruttura.GestioneSoccorso
{
    /// <summary>
    ///   Servizio di salvataggio di una Richiesta di Assistenza
    /// </summary>
    public interface ISaveRichiestaAssistenza
    {
        /// <summary>
        ///   Salva una Richiesta di Assistenza
        /// </summary>
        /// <param name="richiestaAssistenza">Richiesta di Assistenza da salvare</param>
        void Save(RichiestaAssistenza richiestaAssistenza);
    }
}
