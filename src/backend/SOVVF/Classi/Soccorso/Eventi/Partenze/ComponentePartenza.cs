using Modello.Classi.Soccorso.Squadre;

namespace Modello.Classi.Soccorso.Eventi.Partenze
{
    /// <summary>
    ///   Modella il componente di una partenza, con i suoi ruoli, il mezzo sul quale è collocato e
    ///   la squadra a cui è assegnato
    /// </summary>
    public class ComponentePartenza : Componente
    {
        /// <summary>
        ///   E' l'identificativo del mezzo
        /// </summary>
        public string CodiceMezzo { get; set; }

        /// <summary>
        ///   Identificativo assegnato alla squadra al momento della sua definizione. Rappresenta la
        ///   squadra coinvolta nella partenza.
        /// </summary>
        public string Ticket { get; set; }
    }
}
